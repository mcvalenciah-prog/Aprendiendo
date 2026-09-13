import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import InterestsTab from './InterestsTab'
import { interests } from '../data/interests'

describe('InterestsTab (profile-tabs S4)', () => {
  it('renders the four real highlight labels with their descriptions', () => {
    render(<InterestsTab />)

    const labels = ['Multimodal', 'No Invasivo', 'Oportuno', 'UNAL']
    expect(interests.map((area) => area.label)).toEqual(labels)

    for (const area of interests) {
      expect(screen.getByRole('heading', { level: 3, name: area.label })).toBeInTheDocument()
      expect(screen.getByText(area.description)).toBeInTheDocument()
    }
  })
})