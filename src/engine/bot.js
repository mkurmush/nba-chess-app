import { Chess } from "chess.js";

const THINK_DELAY_MS = 400;

let engineWorker = null;
let engineReady = false;
let pendingResolve = null;
let pendingReject = null;

function getEngineWorker() {
  if (engineWorker) {
    return engineWorker;
  }

  engineWorker = new Worker("/stockfish.js");
  engineWorker.onmessage = (event) => {
    const message = typeof event.data === "string" ? event.data : String(event.data);

    if (message === "uciok") {
      engineReady = true;
      return;
    }

    if (message.startsWith("bestmove") && pendingResolve) {
      const parts = message.split(" ");
      const move = parts[1];
      const resolve = pendingResolve;
      pendingResolve = null;
      pendingReject = null;
      resolve(move === "(none)" ? null : move);
    }
  };

  engineWorker.onerror = (error) => {
    if (pendingReject) {
      pendingReject(error);
      pendingResolve = null;
      pendingReject = null;
    }
  };

  engineWorker.postMessage("uci");
  return engineWorker;
}

function waitForEngineReady(worker, timeoutMs = 5000) {
  if (engineReady) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Stockfish engine timed out")), timeoutMs);

    const checkReady = (event) => {
      const message = typeof event.data === "string" ? event.data : String(event.data);
      if (message === "uciok") {
        clearTimeout(timeout);
        worker.removeEventListener("message", checkReady);
        engineReady = true;
        resolve();
      }
    };

    worker.addEventListener("message", checkReady);
  });
}

export async function initEngine() {
  try {
    const worker = getEngineWorker();
    await waitForEngineReady(worker);
    return true;
  } catch {
    return false;
  }
}

function pickRandomMove(game) {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) {
    return null;
  }
  return moves[Math.floor(Math.random() * moves.length)];
}

function pickCaptureOrRandom(game) {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) {
    return null;
  }
  const captures = moves.filter((move) => move.captured);
  const pool = captures.length > 0 ? captures : moves;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getStockfishMove(fen, depth) {
  return new Promise((resolve, reject) => {
    const worker = getEngineWorker();
    pendingResolve = resolve;
    pendingReject = reject;

    worker.postMessage("ucinewgame");
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);
  });
}

export async function getBotMove(game, skillLevel) {
  await new Promise((resolve) => setTimeout(resolve, THINK_DELAY_MS));

  const shouldBlunder =
    skillLevel.blunderChance > 0 && Math.random() < skillLevel.blunderChance;

  if (shouldBlunder) {
    return pickRandomMove(game);
  }

  try {
    const uciMove = await getStockfishMove(game.fen(), skillLevel.depth);
    if (!uciMove) {
      return pickRandomMove(game);
    }

    const from = uciMove.slice(0, 2);
    const to = uciMove.slice(2, 4);
    const promotion = uciMove.length > 4 ? uciMove[4] : undefined;

    const moves = game.moves({ verbose: true });
    const matched = moves.find(
      (move) =>
        move.from === from &&
        move.to === to &&
        (promotion ? move.promotion === promotion : true),
    );

    if (matched) {
      return matched;
    }

    return pickCaptureOrRandom(game);
  } catch {
    return pickCaptureOrRandom(game);
  }
}

export function createGame(fen) {
  return new Chess(fen);
}

export function getGameStatus(game) {
  if (game.isCheckmate()) {
    return game.turn() === "w" ? "You lost — checkmate!" : "You win — checkmate!";
  }
  if (game.isStalemate()) {
    return "Draw — stalemate.";
  }
  if (game.isDraw()) {
    return "Draw.";
  }
  if (game.isCheck()) {
    return "Check!";
  }
  return null;
}
