import type { ResearchArea } from '../types'

// Real research pillars from pagina-web/index.html (read-only source):
// pillar cards with their descriptions and feature lists.
export const researchAreas: ResearchArea[] = [
  {
    title: 'Biomarcadores Acústicos',
    description:
      'Extracción y análisis computacional de la voz para detectar patrones vocales alterados por ansiedad o sintomatología depresiva.',
    features: [
      'Frecuencia Fundamental (F0) y prosodia del habla',
      'Microvariaciones de tono: Jitter & Shimmer',
      'Duración de silencios y pausas respiratorias',
    ],
  },
  {
    title: 'Señales Biométricas',
    description:
      'Monitoreo fisiológico objetivo de la respuesta autonómica al estrés académico mediante sensores portátiles y biomarcadores corporales.',
    features: [
      'Variabilidad del Ritmo Cardíaco (HRV / RMSSD)',
      'Respuesta Galvánica de la Piel (Conductancia / GSR)',
      'Balance del sistema nervioso simpático/parasimpático',
    ],
  },
  {
    title: 'Triage y Canalización UNAL',
    description:
      'Algoritmo de clasificación y estratificación de riesgo para optimizar la atención en Bienestar Universitario y servicios de salud.',
    features: [
      'Estratificación en 3 niveles de prioridad clínica',
      'Disminución de tiempos de espera en atención',
      'Privacidad de datos y ética algorítmica',
    ],
  },
]