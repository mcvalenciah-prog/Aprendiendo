// Domain contracts for the React profile app.
// Content values live in src/data/*.ts; these types only define their shape.

export interface Profile {
  name: string
  role: string
  department: string
  campus: string
  email: string
  phone: string
  cvlac: string
  bio: string[]
  credentials: { title: string; description: string }[]
}

export interface InterestArea {
  label: string
  description: string
}

export interface ResearchArea {
  title: string
  description: string
  features: string[]
}

// acousticRaw is the raw acoustic score before clamping (baseline 45 when no
// voice sample has been processed). stressLevel ranges 1..10.
export interface TriageInput {
  hrv: number
  bpm: number
  stressLevel: number
  symptomCount: number
  acousticRaw: number
}

export interface TriageResult {
  biometric: number
  acoustic: number
  survey: number
  totalRisk: number
  levelLabel: string
  routeTitle: string
  routeText: string
}