import { useCallback, useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { getSkillById } from "../data/players.js";
import {
  createGame,
  getBotMove,
  getGameStatus,
  initEngine,
} from "../engine/bot.js";

function formatMoveHistory(game) {
  const history = game.history();
  const pairs = [];

  for (let i = 0; i < history.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    const whiteMove = history[i];
    const blackMove = history[i + 1];
    pairs.push(
      blackMove
        ? `${moveNumber}. ${whiteMove} ${blackMove}`
        : `${moveNumber}. ${whiteMove}`,
    );
  }

  return pairs.join("  ");
}

export default function GameBoard({ player, skillId, onRematch, onNewOpponent }) {
  const skillLevel = getSkillById(skillId);
  const [game, setGame] = useState(() => createGame(player.fen));
  const [fen, setFen] = useState(player.fen);
  const [status, setStatus] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [engineOnline, setEngineOnline] = useState(null);
  const [gameOverMessage, setGameOverMessage] = useState(null);

  useEffect(() => {
    initEngine().then(setEngineOnline);
  }, []);

  const resetGame = useCallback(() => {
    const nextGame = createGame(player.fen);
    setGame(nextGame);
    setFen(nextGame.fen());
    setStatus(null);
    setGameOverMessage(null);
    setIsThinking(false);
  }, [player.fen]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const runBotTurn = useCallback(
    async (currentGame) => {
      if (currentGame.isGameOver()) {
        return;
      }

      if (currentGame.turn() !== "b") {
        return;
      }

      setIsThinking(true);
      setStatus("Opponent is thinking...");

      try {
        const botMove = await getBotMove(currentGame, skillLevel);
        if (!botMove) {
          return;
        }

        const nextGame = createGame(currentGame.fen());
        nextGame.move({
          from: botMove.from,
          to: botMove.to,
          promotion: botMove.promotion ?? "q",
        });

        setGame(nextGame);
        setFen(nextGame.fen());

        const gameStatus = getGameStatus(nextGame);
        if (gameStatus) {
          setStatus(gameStatus);
          if (nextGame.isGameOver()) {
            setGameOverMessage(gameStatus);
          }
        } else {
          setStatus("Your turn — white to move.");
        }
      } finally {
        setIsThinking(false);
      }
    },
    [skillLevel],
  );

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }) => {
      if (!targetSquare || isThinking || game.isGameOver() || game.turn() !== "w") {
        return false;
      }

      const nextGame = createGame(game.fen());
      const move = nextGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (!move) {
        return false;
      }

      setGame(nextGame);
      setFen(nextGame.fen());

      const gameStatus = getGameStatus(nextGame);
      if (gameStatus) {
        setStatus(gameStatus);
        if (nextGame.isGameOver()) {
          setGameOverMessage(gameStatus);
        }
        return true;
      }

      setStatus("Opponent is thinking...");
      void runBotTurn(nextGame);
      return true;
    },
    [game, isThinking, runBotTurn],
  );

  const chessboardOptions = useMemo(
    () => ({
      position: fen,
      onPieceDrop,
      boardOrientation: "white",
      animationDurationInMs: 200,
      allowDragging: !isThinking && !game.isGameOver(),
      darkSquareStyle: { backgroundColor: "#779556" },
      lightSquareStyle: { backgroundColor: "#ebecd0" },
      boardStyle: {
        borderRadius: "8px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      },
    }),
    [fen, game, isThinking, onPieceDrop],
  );

  return (
    <>
      <section className="screen">
        <div>
          <h2 className="display" style={{ fontSize: "2.4rem" }}>
            {player.emoji} vs {player.name}
          </h2>
          <p className="hero-subtitle">{player.layoutNote}</p>
        </div>

        <div className="game-layout">
          <div className="board-panel">
            <div style={{ width: "min(100%, 520px)" }}>
              <Chessboard options={chessboardOptions} />
            </div>
            <div className={`status-banner ${isThinking ? "thinking" : ""}`}>
              {status ?? "Your turn — white to move."}
            </div>
          </div>

          <div className="side-panel">
            <div className="info-card">
              <h3>{player.nickname}</h3>
              <p className="player-blurb">{player.blurb}</p>
              <p className="layout-note" style={{ marginTop: "0.75rem" }}>
                Skill: {skillLevel.label} (~{skillLevel.approxElo} ELO bot)
              </p>
            </div>

            <div className="info-card">
              <h3>Move list</h3>
              <div className="move-list">
                {game.history().length > 0 ? formatMoveHistory(game) : "No moves yet."}
              </div>
            </div>

            <div className="info-card">
              <h3>Engine</h3>
              <p className="layout-note">
                {engineOnline === null && "Loading Stockfish..."}
                {engineOnline === true &&
                  "Stockfish is running in your browser with depth capped to your skill level."}
                {engineOnline === false &&
                  "Stockfish not found — bot falls back to simpler moves. Run npm run setup:stockfish."}
              </p>
            </div>

            <div className="action-row">
              <button type="button" className="secondary-btn" onClick={onRematch}>
                Rematch
              </button>
              <button type="button" className="ghost-btn" onClick={onNewOpponent}>
                New opponent
              </button>
            </div>
          </div>
        </div>
      </section>

      {gameOverMessage && (
        <div className="result-overlay">
          <div className="result-card">
            <h2>{gameOverMessage}</h2>
            <p className="layout-note">
              {player.name}&apos;s {player.nickname.toLowerCase()} army stays on the board — ready
              for another run?
            </p>
            <div className="action-row" style={{ justifyContent: "center", marginTop: "1rem" }}>
              <button type="button" className="primary-btn" onClick={resetGame}>
                Rematch
              </button>
              <button type="button" className="secondary-btn" onClick={onNewOpponent}>
                New opponent
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
