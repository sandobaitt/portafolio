# DESIGN.md

## Idea

Un corte de las capas en las que trabaja Lautaro. La página baja de la web a la máquina: sitios publicados sobre `paper`, Repulsor en Pharo sobre `steel` y assembler 8086 sobre `machine`, el azul de las pantallas de DOS donde corren los programas de emu8086. El contacto cierra otra vez sobre azul.

La portada lo anticipa: a la derecha del nombre hay un corte con las tres capas apiladas, cada una con material real (captura de IKIGAI y CCR, el método `rotar90`, cuatro instrucciones del final de assembler) y cada una lleva a su sección.

## Color

Estrategia: neutros para las capas de arriba y un azul saturado que ocupa regiones enteras abajo.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--paper` | `#F2F3F5` | `#0F1115` | Suelo de la capa web |
| `--steel` | `#E2E5EB` | `#181B22` | Suelo de la capa de objetos |
| `--machine` | `#1C28B8` | `#1A24A6` | Suelo de la capa máquina y del contacto |
| `--ink` | `#15171C` | `#ECEEF2` | Texto principal |
| `--ink-2` | `#474C59` | `#A9AEBB` | Texto secundario |
| `--ink-3` | `#5A6070` | `#868C9B` | Pies, etiquetas, datos |
| `--accent` | `#1C28B8` | `#9AA2FF` | Botón principal, foco, selección |
| `--machine-yellow` | `#FFE14D` | igual | Acento dentro del azul (instrucciones, subrayado del mail) |
| `--machine-cyan` | `#7FE3FF` | igual | Registros en el código |
| `--p2` | `#C7361A` | `#FF8266` | Jugador rojo del tablero |
| `--power` / `--power-bg` | `#0B6B35` / `#CFEED9` | `#6FDC98` / `#16382A` | Casillas verdes |

Dentro de `.ground-machine` los tokens de tinta y acento se redefinen, así los componentes funcionan igual sobre el azul. Todos los pares de texto pasan 4.5:1 en los dos temas.

## Tipografía

- Archivo (variable, ejes `wght` 100 a 900 y `wdth` 62 a 125), de Omnibus-Type.
  - Nombre y "Escribime": 125% de ancho, peso 850, hasta 6rem, tracking -0.035em.
  - Títulos de sección: 112% de ancho, peso 800, `clamp(2.25rem, 5.2vw, 4.25rem)`.
  - Texto: 100% de ancho, 17px, interlineado 1.6, medida de 60 a 65 caracteres.
- Chivo Mono 400/500, también de Omnibus-Type, solo para código, bits, fechas y etiquetas de profundidad.

## Componentes

- Barra superior fija que toma el suelo de la sección que tiene debajo (se vuelve azul al llegar a la capa máquina). En celular, menú desplegable.
- Botones redondeados (`.btn-primary`, `.btn-quiet`) y enlaces subrayados con flecha (`ExternalLink` / `.link-out`). Los que van a GitHub, LinkedIn o Instagram llevan el logo de la red a la izquierda, al 60% de opacidad, que se enciende al pasar el mouse.
- Herramientas en "Sobre mí": las mismas tres franjas del corte de la portada (web sobre blanco, lenguajes sobre `steel`, sistemas sobre `machine`), con cada tecnología como etiqueta.
- Capturas con borde de 1px, radio de 6px y sombra con desplazamiento; nunca marcos de navegador falsos.
- Código con números de línea y resaltado propio (`Code.jsx`) para Smalltalk y assembler.
- Tablero de Repulsor: grilla de 8×8 botones, fichas que se desplazan con `translate`, flechas que giran siempre en sentido horario.

## Movimiento

La regla: cada animación muestra un mecanismo real del trabajo, y el scroll es la bajada por las capas. Cada capa se mueve en su propio lenguaje.

Al cargar
- Portada: el nombre sube desde una máscara, el texto aparece después y el corte se perfora de arriba hacia abajo (`clip-path`), capa por capa. Unos 1.3 s.
- Corte vivo (`Strata.jsx`): un recorrido baja por las tres capas cada 12 s. En web, el celular de CCR se desplaza; en objetos, la flecha gira como en `rotar90` y se marca la rama del `caseOf`; en máquina, un cursor recorre cuatro instrucciones y cambian `al`, `num` y la pila. Se pausa fuera de pantalla.

Con el scroll (CSS `animation-timeline`, salvo la máquina)
- Portada: al bajar, el corte se separa en sus tres capas, con un pequeño desfase y giro, como una vista en despiece (`--hero`).
- Web: cada captura es una ventana con la captura larga del sitio adentro. Mientras la pieza cruza la pantalla, los sitios se recorren por dentro; el celular sube sobre la computadora y va a otro ritmo (`--shot`).
- Bordes de capa: Repulsor, Assembler y Contacto entran como una placa con las esquinas de arriba redondeadas que se abre a todo el ancho. La sección pinta el suelo anterior y `.layer-fill` el suyo, recortado.
- Objetos: las 64 flechas del tablero giran hasta su dirección en una ola diagonal (propiedad `rotate`, para no pisar el giro del juego). Terminan antes de que el tablero llegue al centro.
- Máquina (`OctalMachine.jsx`, JS): la escena queda fija y la pista de scroll ejecuta el final en 10 pasos. La cinta del registro se corre con cada `shr`, la máscara de `and al, 111b` resalta tres bits, la pila se llena y se vacía y la pantalla imprime 247. El listado sigue a la instrucción activa, como un depurador. Anterior y Siguiente mueven el scroll; Saltar lleva al final de la sección. En pantallas de menos de 540 px de alto la escena no se fija y los botones cambian el paso.
- Herramientas: cada franja entra al marco desde un costado, alternando.
- GitHub: el calendario se dibuja de izquierda a derecha (máscara con `--reveal`).
- Contacto: "Escribime" se abre con el eje `wdth` de Archivo, de 62% a 125%.
- Contacto, tiro al aro (`HoopShot.jsx`): una pelota hace una parábola y encesta en un aro dibujado de perfil. Gira con efecto hacia atrás, se estira y se aplasta apenas al salir y al frenarse en la red; al encestar la red se sacude y aparece "SWISH" con un destello de líneas. Vive en su propio espacio: a la derecha de "Escribime" desde 1280 px, y en una franja arriba del título en tablet y celular. Sin animación se ve la pelota adentro de la red. Es el único naranja del sitio y está solo en la pelota. Los ajustes (tramo de scroll, ancho, colores) están al principio de `HoopShot.css`.
- Barra superior: una línea de profundidad marca cuánto bajaste; en celular, al lado del nombre, aparece la sección actual.

Interacción
- Tablero de Repulsor: las flechas giran 90° en 450 ms y las fichas se deslizan; si una ficha se sale, amaga salir y vuelve. Cada giro marca en `rotar90` la línea del `caseOf` aplicada.
- Las capas del corte se agrandan al pasar el mouse.

Garantías
- Todo lo de scroll en CSS está dentro de `@supports (animation-timeline: view())` y `@media screen and (prefers-reduced-motion: no-preference)`. Con movimiento reducido todo se ve en su estado final, quieto.
- Navegadores sin `animation-timeline` (Firefox 156 incluido): `useScrubFallback` mide los mismos tramos (`--scrub`) con JS y `scroll-fallback.css` mueve las mismas `@keyframes` pausadas y adelantadas según el progreso. Se ve igual que en Chrome.
- Contacto ocupa al menos una pantalla: al ser la última sección, así siempre queda scroll para que el tiro al aro termine.
- Los contenedores que recortan y tienen animaciones de scroll adentro usan `overflow: clip`, no `hidden`: `hidden` los vuelve contenedores de scroll y congela las animaciones de sus hijos.
- Verificado en Chrome y Firefox a 1920, 1440, 820 y 390 px, en claro y oscuro, sin desborde horizontal.

## Superficies del navegador

Selección con el color de acento (amarillo sobre azul en la capa máquina), `caret-color`, barras de scroll del color de las reglas, anillo de foco de 2px con separación de 3px, subrayados con `text-underline-offset`, números tabulares en fechas.

## Recursos

- `public/work/*.webp`: capturas de ccr-landing.vercel.app e ikigai-alpha-eight.vercel.app, tomadas con Chrome headless el 29/09/2026 después de recorrer cada página para que cargue todo. Las `-long` son las versiones largas que se desplazan con el scroll: escritorio 1440×3600 y celular 390×2600. `ikigai-desktop.webp` (1440×900) es la del corte de la portada.
- `public/profile.webp`: `profile.jpeg` reducida a 640 px de ancho.
- `public/og.png`: captura de la portada a 1200×630 para vistas previas en WhatsApp y redes.
- `public/favicon.svg`: la flecha del tablero sobre el azul de la capa máquina.
