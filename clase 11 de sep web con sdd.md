# Clase 11 de septiembre — Web con SDD

Resumen de las partes importantes para obtener el resultado final: página web personal (react-profile) construida con flujo SDD y desplegada en GitHub Pages.

## Paso a paso (solo lo importante)

### 1. Base y decisiones
- Flujo **SDD**: init → explore → propuesta → 4 specs → design → 27 tareas en 3 slices.
- Decisiones clave: sede **Manizales**; se omiten las 7 secciones sin datos; el **motor de triage se porta** (4 tabs: Perfil, Áreas de interés, Áreas de investigación, Simulador Triage); deploy en subcarpeta `pagina-web/react-profile/`.

### 2. Implementación por slices (con tests en cada uno)
- S1: scaffold Vite + React + TS, datos del perfil, cabecera.
- S2: tabs (Perfil, Áreas de interés, Áreas de investigación).
- S3: Simulador Triage (fórmulas reales del `app.js` original) + deploy.
- Cierre: 31 → **33 tests** verdes, build OK, `check-links` limpio.

### 3. Despliegue a GitHub Pages (los 3 trucos que importan)
- `vite.config.ts` con `base: './'` → `dist/` con referencias **relativas**.
- `dist/` **commiteado** (Pages sirve el compilado, no el código fuente).
- **Redirect raíz** → `pagina-web/react-profile/dist/` (el CRITICAL-1 del verify: apuntaba al `index.html` fuente y la app no montaba — se corrigió y re-verificó).

### 4. Verificación y cierre
- Verify final **PASS**: 20/20 requisitos, 27/27 escenarios.
- Archive: specs sincronizados, change cerrado.

### 5. Rediseño visual final
- **Monograma cerebro multimodal** (SVG inline, IA · Psicología · Humano).
- Foto optimizada a **WebP 21 KB** (512×512) con recorte por **saliencia** (`position: attention`), para que se vea la cabeza completa.
- Todo pusheado a `main`; se ve en `https://mcvalenciah-prog.github.io/Aprendiendo/`.

## Configuración empleada en la página

### Framework y build — Vite + React + TS
- `vite.config.ts`: `base: './'` — la clave del deploy (assets relativos servibles en cualquier subruta).
- Build type-safe: `npm run build` = `tsc -b && vite build` (TypeScript 6, project references `tsconfig.app` + `tsconfig.node`).
- React 19.2, Vite 8.3, ESM (`"type": "module"`).

### Testing — Vitest + Testing Library
- `test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts'] }`.
- 7 archivos de test, **33 tests** (componentes + motor de triage con fronteras 39/40 y 69/70).
- Comando de verificación: `npm test -- --run`.

### Diseño — tokens del sitio estático portados
- `src/index.css`: variables heredadas de `pagina-web/styles.css` (fondo oscuro `#070913`, gradiente cyan→violeta→rosa, tipografías Inter/JetBrains Mono).
- Espaciado, radios y sombras como tokens (`--radius-*`, `--shadow-neon`); breakpoint responsive a 768px.

### Assets
- Foto: **WebP 512×512, 21 KB**, recortada con saliencia (`sharp position: attention`).
- Logo: **SVG inline** (sin binarios), escalable, `aria-label` accesible.

### Despliegue — GitHub Pages (repo-root)
- `dist/` commiteado en el repo.
- Redirect raíz (`index.html`) → `pagina-web/react-profile/dist/` (al compilado, no a la fuente).
- `scripts/check-links.sh` valida referencias de todos los HTML (excluye `node_modules`).
- El sitio estático original (`pagina-web/`) queda intacto como fuente de datos.

### Orquestación — OpenSpec (SDD)
- `openspec/config.yaml`: documenta stack, rutas de proyecto, comandos de test por proyecto y rationale de `strict_tdd: false` (el sitio estático no tiene runner).
- 4 specs productivos + tasks archivadas.

## Pendientes
- Activar/verificar GitHub Pages en el repo.
- Confirmar la URL de CVLAC.