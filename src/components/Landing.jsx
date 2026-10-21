export default function Landing({ onStart }) {
  return (
    <section className="screen">
      <span className="hero-badge">NBA × Chess</span>
      <h1 className="hero-title">NBA Playstyle Chess</h1>
      <p className="hero-subtitle">
        What if Stephen Curry&apos;s chess army shot from deep? Pick an NBA legend,
        set your skill level, and play standard chess while your opponent opens with
        a custom board that mirrors their basketball identity.
      </p>
      <div className="info-card">
        <h3>The twist</h3>
        <p className="layout-note">
          You play a normal white army. The bot&apos;s black pieces are arranged to
          reflect their playstyle — bishops for Curry&apos;s range, knights for
          LeBron&apos;s versatility, an early e-pawn push for Jordan&apos;s attack.
          GOAT status does <strong>not</strong> mean Stockfish depth 20. Fairness comes
          from your skill picker, not their fame.
        </p>
      </div>
      <button type="button" className="primary-btn" onClick={onStart}>
        Choose your opponent
      </button>
    </section>
  );
}
