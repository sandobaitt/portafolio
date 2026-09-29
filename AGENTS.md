# AGENTS.md - Portafolio de Lautaro Sandoval

Reglas para cualquier agente que trabaje en este repo. `PRODUCT.md` dice qué es verdad sobre Lautaro y su trabajo; `DESIGN.md` describe el sistema visual. Si algo acá contradice a esos dos archivos, mandan ellos.

## 1. Qué es

- Portafolio personal. Lo leen dos públicos a la vez: instituciones y comercios de Resistencia que necesitan un sitio, y reclutadores que buscan a alguien para un equipo.
- Concepto: la página baja por capas de abstracción. Arriba están los sitios publicados (web), en el medio Repulsor en Pharo (objetos) y abajo el assembler 8086 (máquina). El color del fondo acompaña esa bajada.

## 2. Reglas de diseño

- Tokens en `src/index.css`. Tres suelos: `paper`, `steel` y `machine` (azul `#1C28B8`). Cada sección declara el suyo con la clase `ground-*` y el atributo `data-ground`.
- Tema claro por defecto; el oscuro sigue a `prefers-color-scheme` y se puede elegir con el botón. Todo color nuevo necesita su valor en ambos temas.
- Tipografías: Archivo (con eje de ancho, expandida para títulos) y Chivo Mono, las dos de Omnibus-Type. No usar Inter, Outfit, Montserrat ni otras fuentes genéricas.
- Monoespaciada solo para código y datos (fechas, bits, etiquetas de profundidad).
- Prohibido: texto con gradiente, etiquetas o "badges" arriba de los títulos, brillos (`box-shadow` de color sin desplazamiento), emojis como íconos, tarjetas iguales con ícono + título + texto como estructura de la página.
- Contraste mínimo 4.5:1 para texto, verificado en los dos temas.
- El contenido se ve por defecto. Nada de `opacity: 0` esperando a que la sección entre en pantalla.
- Movimiento: cada animación muestra un mecanismo real del trabajo, y el scroll es la bajada por las capas (detalle en `DESIGN.md`). No agregar efectos decorativos sueltos ni la misma entrada en todas las secciones.
- Animaciones de scroll: siempre dentro de `@supports (animation-timeline: view())` y `@media screen and (prefers-reduced-motion: no-preference)`, con el contenido visible si no corren. Si un contenedor recorta y tiene animaciones de scroll adentro, usar `overflow: clip`, nunca `hidden`.

## 3. Contenido y textos

- Todo el texto vive en `src/content.js`.
- Voseo rioplatense ("escribime", "probalo"), como escribe Lautaro.
- No inventar datos. Cada afirmación sobre un proyecto sale del README o del código de su repo, o la confirma Lautaro. Si falta un dato, se escribe una frase más simple, no una cifra supuesta.
- Antes de publicar texto nuevo, pasarlo por el skill humanizer: sin rayas (—), sin "no es X, es Y", sin tríadas de relleno, sin palabras infladas.

## 4. Stack

- Vite + React 19, CSS vanilla con variables.
- Sin librerías de animación: transiciones CSS y `animation-timeline: view()` con fallback visible.
- `lucide-react` para íconos de interfaz, `react-icons` (solo `fa6`) para los logos de GitHub, LinkedIn e Instagram, `react-github-calendar` para el calendario, `@fontsource` para las fuentes.

## 5. Secciones

1. Inicio: nombre, presentación y un corte de las tres capas que lleva a cada sección.
2. Sitios publicados: IKIGAI y CCR, con capturas reales de escritorio y celular (`public/work/`).
3. Repulsor: texto, método `rotar90` del repo y el tablero jugable (`RepulsorBoard.jsx`).
4. Assembler 8086: el final del 28/08/2025 y la figura de los bits en octal.
5. Sobre mí: foto, texto, estudio e idiomas, y las herramientas en tres franjas como el corte de la portada.
6. GitHub: calendario y repos recientes desde la API.
7. Contacto: mail con botón de copiar y redes con su logo. El pie lleva solo el © y "Volver arriba".

## 6. Antes de dar algo por terminado

- `npm run lint` y `npm run build` sin errores.
- Capturas a 1440 px y 390 px de ancho, en tema claro y oscuro, sin scroll horizontal.
- Si cambian las capturas de los sitios, regenerarlas en `public/work/` en WebP.
