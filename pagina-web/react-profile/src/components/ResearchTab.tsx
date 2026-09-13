import { researchAreas } from '../data/research'

// Presentational tab: the three real research pillars from the static site
// (read-only data source) with their titles, descriptions, and feature lists.
function ResearchTab() {
  return (
    <section className="research-tab" aria-label="Áreas de investigación">
      <h2 className="tab-section-title">Áreas de investigación</h2>
      <div className="research-grid">
        {researchAreas.map((area) => (
          <article key={area.title} className="research-card">
            <h3 className="research-card__title">{area.title}</h3>
            <p className="research-card__description">{area.description}</p>
            <ul className="research-card__features">
              {area.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ResearchTab