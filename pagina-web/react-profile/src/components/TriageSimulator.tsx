import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { computeTriageRisk } from '../lib/triage'
import type { TriageInput } from '../types'

// Defaults mirror the static simulator controls (app.js read-only): HRV 55,
// BPM 78, perceived load 6/10, 2 symptoms and acoustic raw baseline 45.
const DEFAULT_INPUT: TriageInput = {
  hrv: 55,
  bpm: 78,
  stressLevel: 6,
  symptomCount: 2,
  acousticRaw: 45,
}

function levelTier(totalRisk: number) {
  if (totalRisk < 40) return 'low'
  if (totalRisk < 70) return 'med'
  return 'high'
}

// Controlled-form simulator (profile-triage-engine): the five real inputs drive
// computeTriageRisk, which renders the composite score, the level badge, the
// support route and the three channel bars (width = channel score %).
// Spec non-goals: no voice recording and no neural/canvas animation — the
// acoustic raw index is entered directly (baseline 45 = no voice sample).
function TriageSimulator() {
  const [input, setInput] = useState<TriageInput>(DEFAULT_INPUT)
  const result = computeTriageRisk(input)

  const update =
    (field: keyof TriageInput) => (event: ChangeEvent<HTMLInputElement>) =>
      setInput((prev) => ({ ...prev, [field]: Number(event.target.value) }))

  return (
    <section className="triage-simulator" aria-label="Simulador Triage">
      <h2 className="tab-section-title">Simulador Triage</h2>

      <div className="triage-simulator__layout">
        <form
          className="triage-simulator__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <h3 className="triage-simulator__module-title">1. Parámetros Fisiológicos (Biometría)</h3>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="triage-hrv">Variabilidad Cardíaca (HRV / RMSSD):</label>
              <span className="val">{input.hrv} ms</span>
            </div>
            <input
              id="triage-hrv"
              type="range"
              min={20}
              max={110}
              value={input.hrv}
              onChange={update('hrv')}
            />
          </div>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="triage-bpm">Frecuencia Cardíaca en Reposo:</label>
              <span className="val">{input.bpm} BPM</span>
            </div>
            <input
              id="triage-bpm"
              type="range"
              min={55}
              max={130}
              value={input.bpm}
              onChange={update('bpm')}
            />
          </div>

          <h3 className="triage-simulator__module-title">2. Estrés Subjetivo y Síntomas</h3>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="triage-stress">Nivel de Carga Académica Percibida:</label>
              <span className="val">{input.stressLevel}/10</span>
            </div>
            <input
              id="triage-stress"
              type="range"
              min={1}
              max={10}
              value={input.stressLevel}
              onChange={update('stressLevel')}
            />
          </div>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="triage-symptoms">Síntomas Reportados:</label>
              <span className="val">{input.symptomCount}/5</span>
            </div>
            <input
              id="triage-symptoms"
              type="range"
              min={0}
              max={5}
              value={input.symptomCount}
              onChange={update('symptomCount')}
            />
          </div>

          <h3 className="triage-simulator__module-title">3. Muestra Acústica (Simulada)</h3>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="triage-acoustic">Índice Acústico Crudo (jitter y pausas):</label>
              <span className="val">{input.acousticRaw} pts</span>
            </div>
            <input
              id="triage-acoustic"
              type="range"
              min={0}
              max={150}
              value={input.acousticRaw}
              onChange={update('acousticRaw')}
            />
            <p className="control-hint">
              Sin muestra de voz el motor usa la línea base 45 (app.js, read-only).
            </p>
          </div>
        </form>

        <div className="triage-simulator__output">
          <div className="triage-risk-meter">
            <div className="risk-score-display" data-testid="triage-score">
              {result.totalRisk}
            </div>
            <div className={`triage-badge triage-badge--${levelTier(result.totalRisk)}`}>
              {result.levelLabel}
            </div>
            <p className="triage-risk-caption">
              Índice Compuesto de Vulnerabilidad Psicológica (0-100)
            </p>
          </div>

          <div className="multimodal-bars">
            <div className="channel-row">
              <span>Voz y Prosodia (Acústico):</span>
              <div className="channel-bar-wrap">
                <div
                  className="channel-bar-fill fill-acoustic"
                  data-testid="bar-acoustic"
                  style={{ width: `${result.acoustic}%` }}
                />
              </div>
            </div>
            <div className="channel-row">
              <span>Fisiológico (HRV &amp; BPM):</span>
              <div className="channel-bar-wrap">
                <div
                  className="channel-bar-fill fill-biometric"
                  data-testid="bar-biometric"
                  style={{ width: `${result.biometric}%` }}
                />
              </div>
            </div>
            <div className="channel-row">
              <span>Factores Académicos / Estrés:</span>
              <div className="channel-bar-wrap">
                <div
                  className="channel-bar-fill fill-survey"
                  data-testid="bar-survey"
                  style={{ width: `${result.survey}%` }}
                />
              </div>
            </div>
          </div>

          <div className="triage-recommendation">
            <h5>{result.routeTitle}</h5>
            <p>{result.routeText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TriageSimulator