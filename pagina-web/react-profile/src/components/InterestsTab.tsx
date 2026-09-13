import { interests } from '../data/interests'

// Presentational tab: the four real research-interest highlights from the static
// site (read-only data source): Multimodal, No Invasivo, Oportuno, UNAL.
function InterestsTab() {
  return (
    <section className="interests-tab" aria-label="Áreas de interés">
      <h2 className="tab-section-title">Áreas de interés</h2>
      <ul className="highlight-grid">
        {interests.map((area) => (
          <li key={area.label} className="highlight-card">
            <h3 className="highlight-card__label">{area.label}</h3>
            <p className="highlight-card__description">{area.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default InterestsTab