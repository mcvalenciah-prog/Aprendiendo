import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContactHeader from './ContactHeader'
import { profile } from '../data/profile'

describe('ContactHeader', () => {
  it('renders the seven confirmed fields with exact values', () => {
    render(<ContactHeader profile={profile} />)

    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument()
    expect(screen.getByText(profile.role)).toBeInTheDocument()
    expect(screen.getByText(profile.department)).toBeInTheDocument()
    expect(screen.getByText(profile.campus)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    )
    expect(screen.getByText(profile.phone)).toBeInTheDocument()
    expect(screen.getByText('por confirmar')).toBeInTheDocument()
  })

  it('never links CVLAC, Gruplac or Scholar with fabricated URLs', () => {
    render(<ContactHeader profile={profile} />)

    expect(screen.queryByRole('link', { name: /cvlac|gruplac|scholar/i })).not.toBeInTheDocument()

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^mailto:/)
    }
  })

  it('shows Manizales as the sede and never reproduces the Bogotá reference', () => {
    render(<ContactHeader profile={profile} />)

    // Anchored regex: getByText also matches ancestor nodes whose full text
    // contains the pattern, so the match must start at the field value itself.
    expect(screen.getByText(/^Manizales/)).toBeInTheDocument()
    expect(screen.queryByText(/Bogotá/i)).not.toBeInTheDocument()
  })
})