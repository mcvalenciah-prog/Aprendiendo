import { describe, expect, it } from 'vitest'
import { computeTriageRisk, stratifyRisk } from './triage'
import type { TriageInput } from '../types'

// Spec values from profile-triage-engine spec.md (Given/When/Then scenarios).
// Formulas are a verbatim port of pagina-web/app.js (read-only data source).
// This input reproduces the engine spec examples: biometric 39, acoustic 45,
// survey 52 and the fusion total 45.
const SPEC_INPUT: TriageInput = {
  hrv: 55,
  bpm: 78,
  stressLevel: 6,
  symptomCount: 2,
  acousticRaw: 45,
}

describe('biometric channel (profile-triage-engine)', () => {
  it('computes the spec example: HRV 55 / BPM 78 → 39', () => {
    expect(computeTriageRisk(SPEC_INPUT).biometric).toBe(39)
  })

  it('clamps channel extremes: HRV 110 → 0, BPM 130 → 100, score 35', () => {
    expect(computeTriageRisk({ ...SPEC_INPUT, hrv: 110, bpm: 130 }).biometric).toBe(35)
  })
})

describe('acoustic channel (profile-triage-engine)', () => {
  it('keeps the baseline raw score 45 (no voice sample processed)', () => {
    expect(computeTriageRisk(SPEC_INPUT).acoustic).toBe(45)
  })

  it('clamps raw scores below 10 up to the minimum', () => {
    expect(computeTriageRisk({ ...SPEC_INPUT, acousticRaw: 8 }).acoustic).toBe(10)
  })

  it('clamps raw scores above 100 down to the maximum', () => {
    expect(computeTriageRisk({ ...SPEC_INPUT, acousticRaw: 150 }).acoustic).toBe(100)
  })
})

describe('survey channel (profile-triage-engine)', () => {
  it('accumulates symptoms and subjective stress: 2 symptoms, level 6 → 52', () => {
    expect(computeTriageRisk(SPEC_INPUT).survey).toBe(52)
  })

  it('caps the survey at 100: 5 symptoms, level 10 → raw 110', () => {
    expect(
      computeTriageRisk({ ...SPEC_INPUT, stressLevel: 10, symptomCount: 5 }).survey,
    ).toBe(100)
  })
})

describe('weighted fusion (profile-triage-engine)', () => {
  it('rounds the 35/35/30 blend: 39/45/52 → totalRisk 45', () => {
    expect(computeTriageRisk(SPEC_INPUT).totalRisk).toBe(45)
  })
})

describe('risk stratification boundaries (profile-triage-engine)', () => {
  it.each([
    [39, 'Nivel Preventivo (Bajo)', 'Ruta de Acompañamiento: Bienestar y Prevención'],
    [40, 'Nivel Moderado (Soporte)', 'Ruta de Acompañamiento: Intervención Psicoeducativa'],
    [69, 'Nivel Moderado (Soporte)', 'Ruta de Acompañamiento: Intervención Psicoeducativa'],
    [70, 'Atención Prioritaria (Alto)', 'Ruta de Acompañamiento: Consulta Clínica Inmediata'],
  ])('maps totalRisk %i to the real level and support route', (totalRisk, levelLabel, routeTitle) => {
    expect(stratifyRisk(totalRisk)).toMatchObject({ levelLabel, routeTitle })
  })
})

describe('determinism (profile-triage-engine)', () => {
  it('returns identical results for identical inputs', () => {
    expect(computeTriageRisk(SPEC_INPUT)).toEqual(computeTriageRisk(SPEC_INPUT))
  })
})