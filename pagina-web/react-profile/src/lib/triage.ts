import type { TriageInput, TriageResult } from '../types'

// Pure multimodal triage engine ported VERBATIM from pagina-web/app.js
// (read-only data source — do not mirror changes back). Weights 35/35/30,
// strata <40 / <70 / >=70. No DOM access, no randomness: identical inputs
// always produce identical outputs (profile-triage-engine determinism).

export interface RiskStratum {
  levelLabel: string
  routeTitle: string
  routeText: string
}

// Labels, support routes and recommendation paragraphs copied verbatim from
// app.js updateTriageRecommendation(). Boundaries: 39 → Preventivo, 40 →
// Moderado, 69 → Moderado, 70 → Prioritario.
export function stratifyRisk(totalRisk: number): RiskStratum {
  if (totalRisk < 40) {
    return {
      levelLabel: 'Nivel Preventivo (Bajo)',
      routeTitle: 'Ruta de Acompañamiento: Bienestar y Prevención',
      routeText:
        'Los biomarcadores acústicos y de variabilidad cardíaca muestran equilibrio autonómico. Se recomiendan actividades de promoción del autocuidado, pausas activas durante semanas de parciales y mantenimiento de hábitos de descanso saludables en el campus.',
    }
  }
  if (totalRisk < 70) {
    return {
      levelLabel: 'Nivel Moderado (Soporte)',
      routeTitle: 'Ruta de Acompañamiento: Intervención Psicoeducativa',
      routeText:
        'Se detectan alteraciones moderadas en la prosodia vocal y reducción de la reserva autonómica (HRV). Recomendación: Canalización a talleres de gestión de ansiedad académica y técnicas de biofeedback con Bienestar Universitario UNAL.',
    }
  }
  return {
    levelLabel: 'Atención Prioritaria (Alto)',
    routeTitle: 'Ruta de Acompañamiento: Consulta Clínica Inmediata',
    routeText:
      'Convergencia de marcadores acústicos de tensión vocal, desregulación simpática acentuada y múltiples síntomas subjetivos. Se activa la sugerencia de orientación personalizada inmediata con el equipo de Salud y Acompañamiento Estudiantil UNAL.',
  }
}

// app.js formulas, line for line:
//   hrvStress = Math.max(0, 100 - (hrv / 100) * 100)   → max(0, 100 - hrv)
//   bpmStress = Math.min(100, Math.max(0, (bpm - 60) * 1.6))
//   biometric = Math.floor(hrvStress * 0.65 + bpmStress * 0.35)
//   acoustic  = Math.min(100, Math.max(10, acousticRaw))   (baseline raw 45)
//   survey    = Math.min(100, Math.floor(symptomCount * 14 + stressLevel * 10 * 0.4))
//   totalRisk = Math.round(biometric * 0.35 + acoustic * 0.35 + survey * 0.30)
export function computeTriageRisk(input: TriageInput): TriageResult {
  const hrvStress = Math.max(0, 100 - input.hrv)
  const bpmStress = Math.min(100, Math.max(0, (input.bpm - 60) * 1.6))
  const biometric = Math.floor(hrvStress * 0.65 + bpmStress * 0.35)

  const acoustic = Math.min(100, Math.max(10, input.acousticRaw))

  const survey = Math.min(
    100,
    Math.floor(input.symptomCount * 14 + input.stressLevel * 10 * 0.4),
  )

  const totalRisk = Math.round(biometric * 0.35 + acoustic * 0.35 + survey * 0.3)

  return { biometric, acoustic, survey, totalRisk, ...stratifyRisk(totalRisk) }
}