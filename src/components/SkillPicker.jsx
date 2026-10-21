import { SKILL_LEVELS, getPlayerById } from "../data/players.js";

export default function SkillPicker({
  playerId,
  selectedSkillId,
  onSelect,
  onBack,
  onContinue,
}) {
  const player = getPlayerById(playerId);

  return (
    <section className="screen">
      <div>
        <h2 className="display" style={{ fontSize: "2.4rem" }}>
          How tough should {player?.name.split(" ").pop()} play?
        </h2>
        <p className="hero-subtitle">
          Bot strength comes from your skill level — not from being a basketball GOAT.
        </p>
      </div>

      <div className="skill-grid">
        {SKILL_LEVELS.map((skill) => (
          <button
            key={skill.id}
            type="button"
            className={`skill-card ${selectedSkillId === skill.id ? "selected" : ""}`}
            onClick={() => onSelect(skill.id)}
          >
            <div className="skill-label">{skill.label}</div>
            <div className="skill-elo">~{skill.approxElo} ELO equivalent</div>
            <p className="skill-description">{skill.description}</p>
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
          disabled={!selectedSkillId}
          onClick={onContinue}
        >
          Start game vs {player?.name}
        </button>
      </div>
    </section>
  );
}
