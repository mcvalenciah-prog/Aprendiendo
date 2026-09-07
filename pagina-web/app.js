/* ==========================================================================
   LÓGICA INTERACTIVA: Camila Valencia | Psicología, IA & Triage
   - Canvas de Redes Neuronales & Ondas Acústicas
   - Motor del Simulador de Triage Multimodal Universitario
   - Interacción de Contacto y Copiado
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTriageSimulator();
  initContactCopy();
});

/* ==========================================================================
   1. ANIMACIÓN DE REDES NEURONALES & ONDAS (CANVAS)
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.floor((width * height) / 18000);
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.2 + 1,
      baseAlpha: Math.random() * 0.5 + 0.3,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? '#38bdf8' : '#a855f7' // Azul o Púrpura
    });
  }

  let mouseX = -1000;
  let mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar conexiones neuronales (sinapsis)
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      // Movimiento suave
      a.x += a.vx;
      a.y += a.vy;

      if (a.x < 0 || a.x > width) a.vx *= -1;
      if (a.y < 0 || a.y > height) a.vy *= -1;

      // Interacción sutil con el cursor
      const dxMouse = mouseX - a.x;
      const dyMouse = mouseY - a.y;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      if (distMouse < 120) {
        a.x -= (dxMouse / distMouse) * 0.8;
        a.y -= (dyMouse / distMouse) * 0.8;
      }

      // Conexiones entre nodos cercanos
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.color === '#38bdf8' 
            ? `rgba(56, 189, 248, ${alpha})` 
            : `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Dibujar nodo (neurona)
      a.pulsePhase += a.pulseSpeed;
      const currentRadius = a.radius + Math.sin(a.pulsePhase) * 0.6;
      ctx.beginPath();
      ctx.arc(a.x, a.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = a.color;
      ctx.shadowColor = a.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. MOTOR DEL SIMULADOR DE TRIAGE
   ========================================================================== */
function initTriageSimulator() {
  // Elementos de Entrada
  const btnVoiceTest = document.getElementById('btn-voice-test');
  const spectroBars = document.querySelectorAll('.spectro-bar');
  const voiceMetricText = document.getElementById('voice-metric-text');

  const hrvSlider = document.getElementById('slider-hrv');
  const hrvVal = document.getElementById('val-hrv');
  const bpmSlider = document.getElementById('slider-bpm');
  const bpmVal = document.getElementById('val-bpm');
  const stressSlider = document.getElementById('slider-stress');
  const stressVal = document.getElementById('val-stress');

  const symptomButtons = document.querySelectorAll('.symptom-btn');
  const btnCalculate = document.getElementById('btn-calculate-triage');

  // Elementos de Salida
  const riskScoreDisplay = document.getElementById('risk-score-display');
  const riskLevelBadge = document.getElementById('risk-level-badge');
  const barAcoustic = document.getElementById('bar-acoustic');
  const barBiometric = document.getElementById('bar-biometric');
  const barSurvey = document.getElementById('bar-survey');
  const triageRecommendation = document.getElementById('triage-recommendation');

  let acousticStressScore = 45; // Base normal
  let isRecording = false;

  // Actualización de sliders en vivo
  if (hrvSlider && hrvVal) {
    hrvSlider.addEventListener('input', (e) => {
      hrvVal.textContent = `${e.target.value} ms`;
    });
  }
  if (bpmSlider && bpmVal) {
    bpmSlider.addEventListener('input', (e) => {
      bpmVal.textContent = `${e.target.value} BPM`;
    });
  }
  if (stressSlider && stressVal) {
    stressSlider.addEventListener('input', (e) => {
      stressVal.textContent = `${e.target.value}/10`;
    });
  }

  // Toggle de síntomas
  symptomButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
    });
  });

  // Simulación de análisis acústico de voz
  if (btnVoiceTest) {
    btnVoiceTest.addEventListener('click', () => {
      if (isRecording) return;
      isRecording = true;
      btnVoiceTest.classList.add('recording');
      btnVoiceTest.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="6" fill="#ef4444"></circle></svg> Analizando prosodia y tonos...`;

      let frame = 0;
      const interval = setInterval(() => {
        frame++;
        spectroBars.forEach((bar) => {
          const randHeight = Math.floor(Math.random() * 85 + 15);
          bar.style.height = `${randHeight}%`;
        });

        if (frame > 25) {
          clearInterval(interval);
          isRecording = false;
          btnVoiceTest.classList.remove('recording');
          btnVoiceTest.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg> Muestra Acústica Procesada ✓`;

          // Generación de métricas acústicas simuladas
          const jitter = (Math.random() * 1.8 + 0.6).toFixed(2);
          const pauses = (Math.random() * 2.2 + 0.8).toFixed(1);
          acousticStressScore = Math.floor(jitter * 20 + pauses * 15);
          if (voiceMetricText) {
            voiceMetricText.innerHTML = `<strong>Métricas extraídas:</strong> Jitter: ${jitter}% | Pausas latentes: ${pauses}s | F0: 198 Hz`;
          }

          // Reseteo visual de barras
          spectroBars.forEach((bar) => (bar.style.height = '15%'));
        }
      }, 100);
    });
  }

  // Cálculo del algoritmo de Triage
  if (btnCalculate) {
    btnCalculate.addEventListener('click', () => {
      // 1. Canal Biométrico: Menor HRV = Mayor estrés. Mayor BPM = Mayor excitación autonómica
      const hrv = parseInt(hrvSlider ? hrvSlider.value : 55);
      const bpm = parseInt(bpmSlider ? bpmSlider.value : 75);
      const hrvStressComponent = Math.max(0, 100 - (hrv / 100) * 100);
      const bpmStressComponent = Math.min(100, Math.max(0, (bpm - 60) * 1.6));
      const biometricScore = Math.floor((hrvStressComponent * 0.65) + (bpmStressComponent * 0.35));

      // 2. Canal Acústico
      const acousticScore = Math.min(100, Math.max(10, acousticStressScore));

      // 3. Canal Psicométrico / Síntomas
      const selectedSymptoms = document.querySelectorAll('.symptom-btn.selected').length;
      const stressSubjective = parseInt(stressSlider ? stressSlider.value : 5) * 10;
      const surveyScore = Math.min(100, Math.floor((selectedSymptoms * 14) + (stressSubjective * 0.4)));

      // Algoritmo de Fusión Multimodal Ponderado:
      // 35% Biometría (HRV/BPM), 35% Acústica (Voz), 30% Cuestionario/Estrés percibido
      const totalRisk = Math.round(
        (biometricScore * 0.35) + 
        (acousticScore * 0.35) + 
        (surveyScore * 0.30)
      );

      // Animar puntaje numérico
      animateScore(totalRisk);

      // Actualizar barras multimodales
      if (barAcoustic) barAcoustic.style.width = `${acousticScore}%`;
      if (barBiometric) barBiometric.style.width = `${biometricScore}%`;
      if (barSurvey) barSurvey.style.width = `${surveyScore}%`;

      // Estratificación de Triage
      updateTriageRecommendation(totalRisk);
    });
  }

  function animateScore(target) {
    let current = 0;
    const duration = 800;
    const stepTime = 20;
    const increment = Math.ceil(target / (duration / stepTime));

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(counter);
      }
      if (riskScoreDisplay) riskScoreDisplay.textContent = current;
    }, stepTime);
  }

  function updateTriageRecommendation(score) {
    if (!riskLevelBadge || !triageRecommendation) return;

    if (score < 40) {
      riskLevelBadge.className = 'risk-level-tag risk-level-low';
      riskLevelBadge.textContent = 'Nivel Preventivo (Bajo)';
      triageRecommendation.innerHTML = `
        <h5>Ruta de Acompañamiento: Bienestar y Prevención</h5>
        <p>Los biomarcadores acústicos y de variabilidad cardíaca muestran equilibrio autonómico. Se recomiendan actividades de promoción del autocuidado, pausas activas durante semanas de parciales y mantenimiento de hábitos de descanso saludables en el campus.</p>
      `;
    } else if (score < 70) {
      riskLevelBadge.className = 'risk-level-tag risk-level-med';
      riskLevelBadge.textContent = 'Nivel Moderado (Soporte)';
      triageRecommendation.innerHTML = `
        <h5>Ruta de Acompañamiento: Intervención Psicoeducativa</h5>
        <p>Se detectan alteraciones moderadas en la prosodia vocal y reducción de la reserva autonómica (HRV). Recomendación: Canalización a talleres de gestión de ansiedad académica y técnicas de biofeedback con Bienestar Universitario UNAL.</p>
      `;
    } else {
      riskLevelBadge.className = 'risk-level-tag risk-level-high';
      riskLevelBadge.textContent = 'Atención Prioritaria (Alto)';
      triageRecommendation.innerHTML = `
        <h5>Ruta de Acompañamiento: Consulta Clínica Inmediata</h5>
        <p>Convergencia de marcadores acústicos de tensión vocal, desregulación simpática acentuada y múltiples síntomas subjetivos. Se activa la sugerencia de orientación personalizada inmediata con el equipo de Salud y Acompañamiento Estudiantil UNAL.</p>
      `;
    }
  }
}

/* ==========================================================================
   3. COPIAR CORREO Y NOTIFICACIÓN TOAST
   ========================================================================== */
function initContactCopy() {
  const btnCopy = document.getElementById('btn-copy-email');
  const toast = document.getElementById('toast-notice');
  const email = 'mcvalenciah@unal.edu.co';

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(email).then(() => {
        showToast('¡Correo copiado al portapapeles!');
        const originalText = btnCopy.innerHTML;
        btnCopy.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> ¡Copiado!`;
        setTimeout(() => {
          btnCopy.innerHTML = originalText;
        }, 2000);
      }).catch(() => {
        showToast('Correo: ' + email);
      });
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}
