# NBA Playstyle Chess

**What if Stephen Curry's chess army shot from deep?**

A web app where you play standard chess against NBA legend bots — but each bot opens with a custom piece layout inspired by their basketball playstyle. LeBron isn't Stockfish depth 20 just because he's a GOAT. Fairness comes from your skill picker, not their fame.

## The concept

| Player | Basketball identity | Chess layout |
|--------|--------------------|--------------|
| **Stephen Curry** | Deep-range shooter, spacing | Six bishops on the back rank; king and queen already stepped up |
| **LeBron James** | Point forward, does everything | Four knights replace the bishops — versatility everywhere |
| **Michael Jordan** | Relentless attacker | Standard army, but the e-pawn is already on e5 |

You always play **White** with the standard starting army. The bot plays **Black** with a playstyle-inspired formation.

## Quick start

**Requirements:** Node.js 18+ and npm

```bash
cd nba-chess
npm install
npm run setup:stockfish
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### If Stockfish setup fails

Download manually from [stockfish.js releases](https://github.com/nmrugg/stockfish.js/releases/tag/v18.0.0):

1. `stockfish-18-lite-single.js` → rename to `public/stockfish.js`
2. `stockfish-18-lite-single.wasm` → rename to `public/stockfish.wasm`

The bot still works without Stockfish (fallback moves), but skill levels feel best with the engine installed.

## How skill levels work

| Label | ~ELO | Bot behavior |
|-------|------|--------------|
| Just learning | 400 | Depth 1 + 25% random moves |
| Casual | 800 | Depth 2 |
| Club player | 1200 | Depth 3 |
| Strong | 1600 | Depth 4 |

**Important:** Curry, LeBron, and Jordan all use the same skill mapping. Their basketball greatness shows in board layout and flavor text — not in crushing beginners.

## Example layouts (ASCII)

**Curry — Deep Range**
```
8 | r b b b b b b r
7 | p p p . k p p p
6 | . . . . q . . .
  |   (six bishops sniping diagonals)
```

**LeBron — Point Forward**
```
8 | r n n q k n n r
  |   (four knights — full-court general)
```

**Jordan — Attack Mode**
```
7 | p p p . p p p p
5 | . . . . p . . .
  |   (e-pawn already pushed to e5)
```

## Project structure

```
nba-chess/
  src/
    data/players.js      # FEN layouts, blurbs, skill tiers
    engine/bot.js        # Stockfish integration + blunder logic
    components/          # Landing, opponent picker, skill picker, game board
  public/
    stockfish.js         # Downloaded via setup script
    stockfish.wasm
```

The creative core is [`src/data/players.js`](src/data/players.js) — easy to add more NBA legends later.

## What I learned building this

- **FEN strings** encode entire board states — perfect for custom starting positions
- **chess.js** handles move validation; **react-chessboard** handles the UI
- **Stockfish WASM** runs entirely in the browser — no backend needed
- Decoupling **bot strength from player identity** makes the game fun instead of punishing

## Future ideas

- **Shaq** — wall of pawns, slow but immovable
- **Giannis** — knights galore (Euro-step mobility)
- **Draymond Green** — defensive pawn chains
- Import real Lichess games to infer playstyle statistically
- Connect to a chess ML pipeline for live win-probability hints

## Tech stack

- Vite + React
- chess.js
- react-chessboard
- Stockfish.js (browser WASM)

## License

MIT.
