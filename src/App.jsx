import { useState } from "react";
import GameBoard from "./components/GameBoard.jsx";
import Landing from "./components/Landing.jsx";
import OpponentPicker from "./components/OpponentPicker.jsx";
import SkillPicker from "./components/SkillPicker.jsx";
import { getPlayerById } from "./data/players.js";

const SCREENS = {
  landing: "landing",
  opponent: "opponent",
  skill: "skill",
  game: "game",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.landing);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState("learning");
  const [gameKey, setGameKey] = useState(0);

  const selectedPlayer = getPlayerById(selectedPlayerId);

  const startRematch = () => {
    setGameKey((current) => current + 1);
  };

  return (
    <div className="app-shell">
      {screen === SCREENS.landing && (
        <Landing onStart={() => setScreen(SCREENS.opponent)} />
      )}

      {screen === SCREENS.opponent && (
        <OpponentPicker
          selectedId={selectedPlayerId}
          onSelect={setSelectedPlayerId}
          onBack={() => setScreen(SCREENS.landing)}
          onContinue={() => setScreen(SCREENS.skill)}
        />
      )}

      {screen === SCREENS.skill && (
        <SkillPicker
          playerId={selectedPlayerId}
          selectedSkillId={selectedSkillId}
          onSelect={setSelectedSkillId}
          onBack={() => setScreen(SCREENS.opponent)}
          onContinue={() => {
            setGameKey((current) => current + 1);
            setScreen(SCREENS.game);
          }}
        />
      )}

      {screen === SCREENS.game && selectedPlayer && (
        <GameBoard
          key={gameKey}
          player={selectedPlayer}
          skillId={selectedSkillId}
          onRematch={startRematch}
          onNewOpponent={() => setScreen(SCREENS.opponent)}
        />
      )}

      <p className="footer-note" style={{ marginTop: "2rem" }}>
        NBA playstyle as chess piece composition, not engine dominance.
      </p>
    </div>
  );
}
