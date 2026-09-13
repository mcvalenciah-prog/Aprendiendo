import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import TriageSimulator from './TriageSimulator'
import { computeTriageRisk } from '../lib/triage'

// Default form inputs mirror the static simulator values (app.js read-only).
const DEFAULT_INPUT = {
  hrv: 55,
  bpm: 78,
  stressLevel: 6,
  symptomCount: 2,
  acousticRaw: 45,
}

describe('TriageSimulator (profile-triage-engine S6)', () => {
  it('renders the engine output for the default inputs: score, badge, route', () => {
    render(<TriageSimulator />)
    const expected = computeTriageRisk(DEFAULT_INPUT)

    expect(screen.getByTestId('triage-score')).toHaveTextContent(String(expected.totalRisk))
    expect(screen.getByText(expected.levelLabel)).toBeInTheDocument()
    expect(screen.getByText(expected.routeTitle)).toBeInTheDocument()
    expect(screen.getByText(expected.routeText)).toBeInTheDocument()
  })

  it('draws the three channel bars with width equal to each channel score', () => {
    render(<TriageSimulator />)
    const expected = computeTriageRisk(DEFAULT_INPUT)

    expect(screen.getByTestId('bar-acoustic')).toHaveStyle({ width: `${expected.acoustic}%` })
    expect(screen.getByTestId('bar-biometric')).toHaveStyle({ width: `${expected.biometric}%` })
    expect(screen.getByTestId('bar-survey')).toHaveStyle({ width: `${expected.survey}%` })
  })

  it('recomputes the score when an input changes (HRV drop raises risk)', () => {
    render(<TriageSimulator />)

    fireEvent.change(screen.getByLabelText(/Variabilidad Cardíaca/), {
      target: { value: '40' },
    })

    expect(screen.getByTestId('triage-score')).toHaveTextContent('49')
    expect(screen.getByText('Nivel Moderado (Soporte)')).toBeInTheDocument()
  })

  it('shows the high-priority stratum when all channels saturate', () => {
    render(<TriageSimulator />)

    fireEvent.change(screen.getByLabelText(/Variabilidad Cardíaca/), {
      target: { value: '20' },
    })
    fireEvent.change(screen.getByLabelText(/Frecuencia Cardíaca/), {
      target: { value: '130' },
    })
    fireEvent.change(screen.getByLabelText(/Carga Académica/), {
      target: { value: '10' },
    })
    fireEvent.change(screen.getByLabelText(/Síntomas Reportados/), {
      target: { value: '5' },
    })
    fireEvent.change(screen.getByLabelText(/Índice Acústico/), {
      target: { value: '93' },
    })

    expect(screen.getByTestId('triage-score')).toHaveTextContent('93')
    expect(screen.getByText('Atención Prioritaria (Alto)')).toBeInTheDocument()
    expect(
      screen.getByText('Ruta de Acompañamiento: Consulta Clínica Inmediata'),
    ).toBeInTheDocument()
  })

  it('shows the preventive stratum for very low inputs', () => {
    render(<TriageSimulator />)

    fireEvent.change(screen.getByLabelText(/Variabilidad Cardíaca/), {
      target: { value: '110' },
    })
    fireEvent.change(screen.getByLabelText(/Frecuencia Cardíaca/), {
      target: { value: '55' },
    })
    fireEvent.change(screen.getByLabelText(/Carga Académica/), {
      target: { value: '1' },
    })
    fireEvent.change(screen.getByLabelText(/Síntomas Reportados/), {
      target: { value: '0' },
    })
    fireEvent.change(screen.getByLabelText(/Índice Acústico/), {
      target: { value: '10' },
    })

    expect(screen.getByTestId('triage-score')).toHaveTextContent('5')
    expect(screen.getByText('Nivel Preventivo (Bajo)')).toBeInTheDocument()
    expect(
      screen.getByText('Ruta de Acompañamiento: Bienestar y Prevención'),
    ).toBeInTheDocument()
  })
})