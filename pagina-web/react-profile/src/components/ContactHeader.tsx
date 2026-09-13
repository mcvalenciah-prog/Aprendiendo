import type { Profile } from '../types'

interface ContactHeaderProps {
  profile: Profile
}

// Presentational header with the seven confirmed UNAL Manizales fields.
// CVLAC renders as plain text: its URL is "por confirmar", so no anchor and
// no fabricated link is emitted (profile-contact-header link policy).
function ContactHeader({ profile }: ContactHeaderProps) {
  return (
    <header className="contact-header">
      <p className="contact-header__role">{profile.role}</p>
      <h1 className="contact-header__name">{profile.name}</h1>
      <dl className="contact-header__fields">
        <div className="contact-header__field">
          <dt>Dependencia</dt>
          <dd>{profile.department}</dd>
        </div>
        <div className="contact-header__field">
          <dt>Sede</dt>
          <dd>{profile.campus}</dd>
        </div>
        <div className="contact-header__field">
          <dt>Correo</dt>
          <dd>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </dd>
        </div>
        <div className="contact-header__field">
          <dt>Teléfono</dt>
          <dd>{profile.phone}</dd>
        </div>
        <div className="contact-header__field">
          <dt>CVLAC</dt>
          <dd>{profile.cvlac}</dd>
        </div>
      </dl>
    </header>
  )
}

export default ContactHeader