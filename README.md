# Portafolio

Mi sitio personal: [sando-portafolio.vercel.app](https://sando-portafolio.vercel.app).

La página baja por las capas en las que trabajo. Arriba están los sitios que hice para instituciones de Resistencia, en el medio Repulsor (un juego de tablero en Pharo que se puede jugar en la página) y abajo un final de assembler 8086 resuelto.

## Correrlo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run lint     # oxlint
```

## Cómo está armado

- Vite + React 19 y CSS con variables. No usa librerías de animación.
- `src/content.js` tiene todos los textos y datos de los proyectos.
- `src/components/RepulsorBoard.jsx` implementa las reglas de Repulsor siguiendo el código original en Pharo.
- `src/components/Code.jsx` resalta Smalltalk y assembler sin dependencias.
- El calendario y la lista de repos se cargan desde la API de GitHub.

`DESIGN.md` describe el sistema visual y `PRODUCT.md` de dónde sale cada dato.

## Créditos

Tipografías Archivo y Chivo Mono, de [Omnibus-Type](https://www.omnibus-type.com), con licencia OFL. Íconos de [Lucide](https://lucide.dev).
