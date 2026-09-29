// Todo el texto del sitio vive acá. Los datos de cada proyecto salen de su
// README en GitHub; si algo cambia en un repo, se actualiza en este archivo.

export const person = {
  name: 'Lautaro Sandoval',
  fullName: 'Lautaro Emanuel Sandoval',
  email: 'lautaroemanuelsandoval@gmail.com',
  location: 'Resistencia, Chaco',
  github: 'https://github.com/sandobaitt',
  githubUser: 'sandobaitt',
  linkedin: 'https://www.linkedin.com/in/lautarosandoval',
  instagram: 'https://instagram.com/lautisando_',
};

export const hero = {
  lead:
    'Hago sitios web para instituciones de Resistencia y estudio Ingeniería en Sistemas de Información en la UTN. En la facultad programo desde objetos en Pharo hasta assembler 8086.',
};

// Orden de las secciones = orden de las capas, de la web a la máquina.
export const sections = [
  { id: 'sitios', label: 'Sitios', ground: 'paper' },
  { id: 'repulsor', label: 'Repulsor', ground: 'steel' },
  { id: 'assembler', label: 'Assembler', ground: 'machine' },
  { id: 'sobre-mi', label: 'Sobre mí', ground: 'paper' },
  { id: 'github', label: 'GitHub', ground: 'paper' },
  { id: 'contacto', label: 'Contacto', ground: 'machine' },
];

export const strata = [
  { id: 'sitios', depth: 'web', title: 'Sitios publicados', detail: 'IKIGAI y CCR' },
  { id: 'repulsor', depth: 'objetos', title: 'Repulsor', detail: 'Pharo' },
  { id: 'assembler', depth: 'máquina', title: 'Assembler 8086', detail: 'emu8086' },
];

export const sites = {
  intro: 'Dos sitios que están en línea, hechos para instituciones de la ciudad.',
  items: [
    {
      id: 'ikigai',
      name: 'Instituto de Clínicas IKIGAI',
      place: 'Av. Paraguay 636, Resistencia',
      summary:
        'El instituto reúne medicina clínica, salud mental, nutrición y terapias del neurodesarrollo. El centro del sitio es el directorio de 14 profesionales en cinco áreas: se puede filtrar por área o buscar por nombre, y cada especialista tiene un botón de WhatsApp que abre el chat con el mensaje ya escrito.',
      detail:
        'Está hecho con HTML, CSS y JavaScript, sin framework en el cliente, y tiene datos estructurados de Schema.org para búsquedas locales.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Schema.org'],
      url: 'https://ikigai-alpha-eight.vercel.app',
      repo: 'https://github.com/sandobaitt/IKIGAI',
      desktop: '/work/ikigai-desktop-long.webp',
      mobile: '/work/ikigai-mobile-long.webp',
    },
    {
      id: 'ccr',
      name: 'Crecer con Cristo Redentor',
      place: 'Comunidad juvenil de la Parroquia Asunción, Resistencia',
      summary:
        'Los voluntarios de la comunidad cargan las fechas de retiros y las novedades desde Sanity, un CMS, sin tocar código. Arriba corre una cinta con los horarios de misa, y la galería de imágenes gira en 3D con WebGL.',
      detail: null,
      stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Sanity', 'Framer Motion'],
      url: 'https://ccr-landing.vercel.app',
      repo: 'https://github.com/sandobaitt/ccr-landing',
      desktop: '/work/ccr-desktop-long.webp',
      mobile: '/work/ccr-mobile-long.webp',
    },
  ],
};

export const repulsor = {
  course: 'TPI de Paradigmas de Programación',
  paragraphs: [
    'Es un juego de tablero para dos. Cada casilla tiene una flecha: en tu turno avanzás una casilla hacia donde apunta, y la casilla que dejás gira 90° en sentido horario. Si la flecha te saca del tablero perdés una vida y te quedás donde estabas. Las casillas verdes suman una vida, y gana el último que sigue en pie.',
    'Lo hicimos en un equipo de seis. La versión completa está en Pharo, con interfaz en Spec y un minijuego de adivinanza contra la máquina que decide quién elige el tamaño del tablero (8×8 o 10×10) y quién arranca. Antes hicimos un prototipo en Python para probar la rotación.',
  ],
  codeCaption: 'Celda>>rotar90, tal cual está en el repo',
  code: `rotar90
    "Cambia la dirección 90° en sentido horario."
    direccion := direccion
        caseOf: {
            [ #arriba ]    -> [ #derecha ].
            [ #derecha ]   -> [ #abajo ].
            [ #abajo ]     -> [ #izquierda ].
            [ #izquierda ] -> [ #arriba ] }
        otherwise: [ direccion ].`,
  demoNote:
    'La regla principal, para dos jugadores en la misma pantalla. No incluye el minijuego del principio.',
  repo: 'https://github.com/sandobaitt/TPI-Paradigmas-',
};

export const assembler = {
  course: 'Arquitectura de Computadoras, UTN FRRE',
  paragraphs: [
    'Es el repositorio que armamos con Mariano Del Valle y Paula Kozak para rendir Arquitectura de Computadoras. Yo escribí el resumen de fundamentos y resolví 14 finales tomados entre 2022 y 2026. Mariano resolvió la guía de ejercicios y Paula, otra parte de los finales. Todo corre en emu8086.',
  ],
  exampleTitle: 'Final del 28/08/2025: mostrar 10100111b en octal',
  code: `.data
    num db 10100111b
.code
    ; Inicializo segmento de datos
    mov dx, @data
    mov ds, dx

    ; Inicializo
    mov cx, 3

    extraigo:
        xor ax, ax
        mov al, num
        and al, 111b

        push ax     ; Guardo valor en la pila

        shr num, 3  ; Desplazo a derecha y se rellena desde izquierda con 0s

        dec cx
        cmp cx, 0
        jne Extraigo

    print 'El numero binario a octal es: '
    mov cx, 3

    muestro:
        pop ax
        add al, 48d
        mov dl, al

        mov ah, 02h
        int 21h

        xor ax, ax
        dec cx
        cmp cx, 0
        jne muestro

    mov ah, 4ch
    int 21h`,
  source: 'https://github.com/sandobaitt/Assembler/blob/main/Finales/28-08-2025/sando.asm',
  repo: 'https://github.com/sandobaitt/Assembler',
};

export const about = {
  paragraphs: [
    'Me gusta entender qué pasa debajo de lo que uso, y por eso las materias de bajo nivel están entre las que más disfruto. También sigo de cerca lo que sale en inteligencia artificial.',
    'Fuera de la cursada hago sitios web y practico programación competitiva. Últimamente me estoy metiendo en ciberseguridad con CTFs.',
  ],
  facts: [
    { term: 'Estudio', value: 'Ingeniería en Sistemas de Información, UTN Facultad Regional Resistencia' },
    {
      term: 'Idiomas',
      value: 'Español nativo. Inglés técnico, entre B1 y B2: leo documentación y escribo commits e issues en inglés.',
    },
  ],
  // Mismas tres capas que el corte de la portada.
  tools: [
    {
      id: 'web',
      name: 'Web',
      items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Sanity', 'Vite', 'Vercel'],
    },
    { id: 'lenguajes', name: 'Lenguajes', items: ['Python', 'C', 'C++', 'Go', 'Pharo (Smalltalk)', 'Haskell'] },
    { id: 'sistemas', name: 'Sistemas', items: ['Assembler 8086', 'Linux', 'Bash', 'Git', 'MySQL'] },
  ],
};

export const github = {
  intro: 'Mis contribuciones del último año y los últimos repositorios en los que trabajé.',
};

export const contact = {
  heading: 'Escribime',
  text:
    'Si necesitás un sitio para tu institución o comercio, o estás armando un equipo y buscás a alguien, contame qué tenés en mente.',
};
