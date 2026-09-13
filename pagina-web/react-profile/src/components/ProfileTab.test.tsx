import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProfileTab from './ProfileTab'
import { profile } from '../data/profile'

describe('ProfileTab (profile-tabs S3)', () => {
  it('renders the two real bio paragraphs on triage de salud mental', () => {
    render(<ProfileTab />)

    for (const paragraph of profile.bio) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })

  it('renders the four real credentials with their descriptions', () => {
    render(<ProfileTab />)

    const titles = ['Procesamiento de Voz', 'Biometría del Estrés', 'Ética y Privacidad', 'Impacto Comunitario']
    expect(profile.credentials.map((credential) => credential.title)).toEqual(titles)

    for (const credential of profile.credentials) {
      expect(screen.getByRole('heading', { level: 3, name: credential.title })).toBeInTheDocument()
      expect(screen.getByText(credential.description)).toBeInTheDocument()
    }
  })
})