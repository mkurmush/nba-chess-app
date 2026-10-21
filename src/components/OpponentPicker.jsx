import { PLAYERS } from "../data/players.js";

export default function OpponentPicker({ selectedId, onSelect, onBack, onContinue }) {
  return (
    <section className="screen">
      <div>
        <h2 className="display" style={{ fontSize: "2.4rem" }}>
          Pick your opponent
        </h2>
        <p className="hero-subtitle">
          Each legend brings a different army layout inspired by how they play basketball.
        </p>
      </div>

      <div className="card-grid">
        {PLAYERS.map((player) => (
          <button
            key={player.id}
            type="button"
            className={`player-card ${selectedId === player.id ? "selected" : ""}`}
            style={{
              "--accent": player.accent,
              "--accent-light": player.accentLight,
            }}
            onClick={() => onSelect(player.id)}
          >
            <div className="player-card-top">
              <span className="player-emoji">{player.emoji}</span>
              <span className="player-nickname">{player.nickname}</span>
            </div>
            <h3 className="player-name">{player.name}</h3>
            <p className="player-blurb">{player.blurb}</p>
            <p className="layout-note" style={{ marginTop: "0.75rem" }}>
              {player.layoutNote}
            </p>
          </button>
        ))}
      </div>

      <div className="action-row">
        <button type="button" className="ghost-btn" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="primary-btn"
          disabled={!selectedId}
          onClick={onContinue}
        >
          Set skill level
        </button>
      </div>
    </section>
  );
}
