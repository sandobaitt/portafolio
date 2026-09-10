# AGENTS.md - Portfolio Knowledge & Rules

Este archivo contiene las directrices principales y el contexto del proyecto para que los agentes de Antigravity sigan de manera consistente durante el desarrollo del portafolio.

## 1. Identidad del Proyecto
- **Tipo:** Portafolio Web Personal para Desarrollador.
- **Estilo de Diseño:** Minimalista, con alto contraste (Storytelling visual).
- **Core Design System:** Basado en los principios de `ui-ux-pro-max-skill` (Clean Tech Minimal).

## 2. Reglas de Diseño (UI/UX)
- **Modos:** Soporte nativo para Dark Mode (principal) y Light Mode. Las transiciones deben ser fluidas y basadas en variables CSS.
- **Animaciones:** Utilizar animaciones sutiles (Fade-ups, staggers) y micro-interacciones (hover states). Evitar animaciones lentas o intrusivas (evitar motion sickness).
- **Tipografía:** Usar fuentes geométricas modernas. `Outfit` para encabezados y `Inter` para cuerpos de texto.
- **Colores:** Mantener el fondo neutro (Oscuro: #121212, Claro: #FAFAFA) y utilizar colores vibrantes (como azul eléctrico) solo para acentos y Call-to-Actions.
- **Accesibilidad:** Mantener un alto contraste (mínimo 4.5:1) y asegurarse de que el modo oscuro/claro respete las preferencias del sistema (`prefers-color-scheme`).

## 3. Tecnologías (Stack Propuesto)
- Vite + React
- Vanilla CSS (con Variables CSS para los temas).
- Framer Motion (para animaciones complejas en el scroll).

## 4. Secciones del Portafolio
1. **Hero (Inicio):** Presentación principal con animación de impacto.
2. **Sobre Mí:** Descripción personal e historia.
3. **Habilidades (Skills):** Grid o lista visual de tecnologías.
4. **Proyectos:** Tarjetas interactivas con los mejores trabajos.
5. **Contribuciones en GitHub:** Visualización de la actividad y repositorios destacados.
6. **Contacto:** Enlaces a redes y formulario o email directo.
