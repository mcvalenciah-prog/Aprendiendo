import type { Profile } from '../types'

// Real content from pagina-web/index.html (read-only data source):
// about section (bio paragraphs) and credentials-list (4 credential cards).
export const profile: Profile = {
  name: 'Camila Valencia H.',
  role: 'Estudiante de maestría',
  department: 'Grupo de Control y Procesamiento Digital de Señales',
  campus: 'Manizales (Universidad Nacional de Colombia)',
  email: 'mcvalenciah@unal.edu.co',
  phone: '3215753334',
  // CVLAC URL is not confirmed yet — keep the visible label, no fake link.
  cvlac: 'por confirmar',
  bio: [
    'Mi trabajo investigativo se enfoca en el desarrollo de herramientas de triage de salud mental dirigidas a entornos universitarios. Combino la rigurosidad científica de la psicología clínica con las capacidades de la inteligencia artificial y el procesamiento digital de señales (acústicas y biométricas).',
    'La vida universitaria somete a los estudiantes a altos niveles de presión académica, alteraciones circadianas y aislamiento social. Mediante el análisis no invasivo de la voz y señales autonómicas como la variabilidad cardíaca, buscamos detectar tempranamente las señales de alerta, reduciendo el estigma y facilitando un canal oportuno hacia el apoyo psicológico universitario.',
  ],
  credentials: [
    {
      title: 'Procesamiento de Voz',
      description: 'Extracción de prosodia, jitter, shimmer y marcadores fonéticos.',
    },
    {
      title: 'Biometría del Estrés',
      description: 'Análisis de HRV, respuesta galvánica y balance autonómico.',
    },
    {
      title: 'Ética y Privacidad',
      description: 'Modelos explicables (XAI) con respeto total por la privacidad del estudiante.',
    },
    {
      title: 'Impacto Comunitario',
      description: 'Optimización del flujo de atención en Bienestar Universitario UNAL.',
    },
  ],
}