import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

// S2 renders the three content tabs; 'Simulador Triage' lands with S3 and is
// deliberately not asserted here (it belongs to the S3 test suite).
const CONTENT_TABS = ['Perfil profesional', 'Áreas de interés', 'Áreas de investigación']

// profile-tabs S5: the seven data-less Hermes sections must never render.
const OMITTED_SECTIONS = [
  'Publicaciones',
  'Asignaturas',
  'Grupos',
  'Proyectos',
  'Laboratorios',
  'Eventos',
  'Enlaces',
]

describe('App tab navigation (profile-tabs S1-S2)', () => {
  it('renders the tab bar with the content tabs and Perfil profesional as default', () => {
    render(<App />)

    for (const label of CONTENT_TABS) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
    expect(
      screen.getByRole('heading', { level: 2, name: 'Perfil profesional' }),
    ).toBeInTheDocument()
  })

  it('switches content by tab state without changing the URL or reloading', () => {
    render(<App />)
    const urlBefore = window.location.href

    fireEvent.click(screen.getByRole('button', { name: 'Áreas de investigación' }))

    expect(
      screen.getByRole('heading', { level: 2, name: 'Áreas de investigación' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Perfil profesional' }),
    ).not.toBeInTheDocument()
    expect(window.location.href).toBe(urlBefore)
  })
})

describe('App omitted sections (profile-tabs S5)', () => {
  it.each(CONTENT_TABS)('never renders the seven data-less sections on %s', (tabLabel) => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: tabLabel }))

    for (const label of OMITTED_SECTIONS) {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    }
  })
})