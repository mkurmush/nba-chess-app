export const SKILL_LEVELS = [
  {
    id: "learning",
    label: "Just learning",
    approxElo: 400,
    depth: 1,
    blunderChance: 0.25,
    description: "Perfect for your first games — the bot keeps it friendly.",
  },
  {
    id: "casual",
    label: "Casual",
    approxElo: 800,
    depth: 2,
    blunderChance: 0,
    description: "A relaxed match with occasional mistakes.",
  },
  {
    id: "club",
    label: "Club player",
    approxElo: 1200,
    depth: 3,
    blunderChance: 0,
    description: "Solid play without going full grandmaster.",
  },
  {
    id: "strong",
    label: "Strong",
    approxElo: 1600,
    depth: 4,
    blunderChance: 0,
    description: "Sharper tactics — still not Stockfish at full power.",
  },
];

export const PLAYERS = [
  {
    id: "curry",
    name: "Stephen Curry",
    nickname: "Deep Range",
    emoji: "🏀",
    accent: "#1D428A",
    accentLight: "#FDB927",
    blurb: "Spacing killers — bishops control every diagonal from deep.",
    layoutNote: "Six bishops on the back rank. King and queen already stepped up — Curry doesn't wait at the arc.",
    fen: "rbbbbbbr/ppp1kppp/4q3/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1",
  },
  {
    id: "lebron",
    name: "LeBron James",
    nickname: "Point Forward",
    emoji: "👑",
    accent: "#6F263D",
    accentLight: "#FFB81C",
    blurb: "The full-court general — knights everywhere, always making the right play.",
    layoutNote: "Four knights replace the bishops — versatility in every direction.",
    fen: "rnnqknnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  },
  {
    id: "jordan",
    name: "Michael Jordan",
    nickname: "Attack Mode",
    emoji: "🐐",
    accent: "#CE1141",
    accentLight: "#000000",
    blurb: "First to strike — Jordan doesn't wait for you to set up.",
    layoutNote: "Standard army, but the e-pawn is already on e5 — Mamba goes early.",
    fen: "rnbqkbnr/ppp1pppp/8/4p3/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  },
];

export function getPlayerById(id) {
  return PLAYERS.find((player) => player.id === id);
}

export function getSkillById(id) {
  return SKILL_LEVELS.find((skill) => skill.id === id);
}
