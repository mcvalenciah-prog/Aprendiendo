import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResearchTab from './ResearchTab'
import { researchAreas } from '../data/research'

describe('ResearchTab (profile-tabs S5)', () => {
  it('renders the three real research areas with titles, descriptions, and features', () => {
    render(<ResearchTab />)

    const titles = [
      'Biomarcadores Acústicos',
      'Señales Biométricas',
      'Triage y Canalización UNAL',
    ]
    expect(researchAreas.map((area) => area.title)).toEqual(titles)

    for (const area of researchAreas) {
      expect(screen.getByRole('heading', { level: 3, name: area.title })).toBeInTheDocument()
      expect(screen.getByText(area.description)).toBeInTheDocument()
      for (const feature of area.features) {
        expect(screen.getByText(feature)).toBeInTheDocument()
      }
    }
  })
})