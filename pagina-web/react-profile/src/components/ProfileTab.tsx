import { profile } from '../data/profile'

// Presentational tab: real bio and credentials from the static site (read-only).
// Renders the two bio paragraphs and the four real credential cards (profile-tabs S3).
function ProfileTab() {
  return (
    <section className="profile-tab" aria-label="Perfil profesional">
      <h2 className="tab-section-title">Perfil profesional</h2>
      <div className="profile-tab__bio">
        {profile.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className="credential-list">
        {profile.credentials.map((credential) => (
          <li key={credential.title} className="credential-card">
            <h3 className="credential-card__title">{credential.title}</h3>
            <p className="credential-card__description">{credential.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProfileTab