import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Terminal, 
  TerminalSquare, 
  Cpu, 
  Languages, 
  Layers, 
  CheckCircle2,
  Sparkles,
  MessageSquare,
  FileText,
  BookOpen
} from 'lucide-react';
import { 
  FaReact, 
  FaPython, 
  FaLinux, 
  FaGithub, 
  FaNodeJs, 
  FaHtml5, 
  FaCss3Alt, 
  FaGitAlt 
} from 'react-icons/fa';
import { 
  SiJavascript, 
  SiCplusplus, 
  SiC, 
  SiMysql, 
  SiGnubash, 
  SiTailwindcss, 
  SiFramer, 
  SiVite, 
  SiVercel 
} from 'react-icons/si';
import './Skills.css';

const Skills = () => {
  // Fila 1: Frontend & UI
  const row1 = [
    { name: "React", icon: <FaReact color="#61DAFB" /> },
    { name: "JavaScript", icon: <SiJavascript color="#F7DF1E" /> },
    { name: "HTML5", icon: <FaHtml5 color="#E34F26" /> },
    { name: "CSS3", icon: <FaCss3Alt color="#1572B6" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss color="#06B6D4" /> },
    { name: "Vite", icon: <SiVite color="#646CFF" /> },
    { name: "Framer Motion", icon: <SiFramer color="#0055FF" /> }
  ];

  // Fila 2: Backend, Lógica & Lenguajes
  const row2 = [
    { name: "Python", icon: <FaPython color="#3776AB" /> },
    { name: "Node.js", icon: <FaNodeJs color="#339933" /> },
    { name: "C++", icon: <SiCplusplus color="#00599C" /> },
    { name: "C", icon: <SiC color="#A8B9CC" /> },
    { name: "Smalltalk", icon: <Terminal color="#FF5500" /> },
    { name: "Assembler x86", icon: <Cpu color="#10B981" /> },
    { name: "MySQL", icon: <SiMysql color="#4479A1" /> }
  ];

  // Fila 3: Entornos, DevOps & Herramientas
  const row3 = [
    { name: "Linux", icon: <FaLinux color="#FCC624" /> },
    { name: "Bash", icon: <SiGnubash color="#4EAA25" /> },
    { name: "Git", icon: <FaGitAlt color="#F05032" /> },
    { name: "GitHub", icon: <FaGithub color="#E2E8F0" /> },
    { name: "Vercel", icon: <SiVercel color="#E2E8F0" /> },
    { name: "Terminal / CLI", icon: <TerminalSquare color="#38BDF8" /> },
    { name: "Responsive UI", icon: <Globe color="#FF5500" /> }
  ];

  // Idiomas con la misma estructura y datos enriquecidos que los proyectos
  const languages = [
    {
      id: "es",
      name: "Español",
      level: "Nativo / Lengua Materna",
      affiliation: "Fluidez Absoluta",
      accent: "#ff5500",
      flag: "🇦🇷",
      description: "Dominio lingüístico completo y natural, con sólida capacidad para estructuración de ideas complejas, documentación clara y comunicación interpersonal.",
      highlights: [
        {
          icon: <MessageSquare size={16} />,
          text: "Comunicación fluida y articulada en dinámicas de equipo ágiles"
        },
        {
          icon: <FileText size={16} />,
          text: "Redacción estructurada, especificaciones y documentación técnica"
        },
        {
          icon: <CheckCircle2 size={16} />,
          text: "Claridad en el análisis y formulación de requerimientos de software"
        },
        {
          icon: <Sparkles size={16} />,
          text: "Capacidad de síntesis conceptual para resolución de problemas técnicos"
        }
      ],
      tags: ["Nativo", "Fluidez Total", "Redacción Técnica", "Comunicación Ágil"]
    },
    {
      id: "en",
      name: "Inglés",
      level: "Técnico Profesional (B1 / B2)",
      affiliation: "Documentación & Desarrollo",
      accent: "#38bdf8",
      flag: "🇺🇸",
      description: "Capacidad sólida de asimilación técnica, lectura analítica y comunicación escrita en plataformas y ecosistemas globales de desarrollo.",
      highlights: [
        {
          icon: <BookOpen size={16} />,
          text: "Lectura fluida de documentación oficial, RFCs y papers técnicos"
        },
        {
          icon: <FileText size={16} />,
          text: "Redacción precisa de commits, pull requests, issues y manuales"
        },
        {
          icon: <CheckCircle2 size={16} />,
          text: "Comprensión auditiva en conferencias, tutoriales y podcasts técnicos"
        },
        {
          icon: <Sparkles size={16} />,
          text: "Perfeccionamiento continuo orientado a arquitectura y buenas prácticas"
        }
      ],
      tags: ["Técnico Profesional", "Docs & RFCs", "Escritura Dev", "En Formación Continua"]
    }
  ];

  const languagesContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const languageCardVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
  };

  return (
    <section className="skills section container" id="skills">
      <div className="section-header-tech">
        <div className="section-badge-tech">
          <Sparkles size={15} />
          <span>Stack Tecnológico</span>
        </div>
        <h2 className="section-title">
          Tecnologías & <span className="text-gradient">Herramientas</span>
        </h2>
        <p className="section-subtitle-tech">
          Ecosistema de lenguajes, frameworks y entornos con los que construyo soluciones.
        </p>
      </div>

      {/* Carrusel Infinito Intercalado de Tecnologías */}
      <div className="tech-carousel-container">
        {/* Fila 1: Hacia la izquierda */}
        <div className="tech-marquee-wrapper">
          <div className="tech-marquee-track marquee-left">
            {[...row1, ...row1, ...row1].map((tech, idx) => (
              <div key={`row1-${idx}`} className="tech-pill-card">
                <span className="tech-pill-icon">{tech.icon}</span>
                <span className="tech-pill-label">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fila 2: Hacia la derecha */}
        <div className="tech-marquee-wrapper">
          <div className="tech-marquee-track marquee-right">
            {[...row2, ...row2, ...row2].map((tech, idx) => (
              <div key={`row2-${idx}`} className="tech-pill-card">
                <span className="tech-pill-icon">{tech.icon}</span>
                <span className="tech-pill-label">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fila 3: Hacia la izquierda */}
        <div className="tech-marquee-wrapper">
          <div className="tech-marquee-track marquee-left-slow">
            {[...row3, ...row3, ...row3].map((tech, idx) => (
              <div key={`row3-${idx}`} className="tech-pill-card">
                <span className="tech-pill-icon">{tech.icon}</span>
                <span className="tech-pill-label">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apartado de Idiomas con el diseño y animaciones de Proyectos */}
      <div className="languages-container">
        <div className="section-header-tech languages-header-tech">
          <div className="section-badge-tech">
            <Languages size={15} />
            <span>Idiomas & Comunicación</span>
          </div>
          <h3 className="section-title">
            Competencias <span className="text-gradient">Lingüísticas</span>
          </h3>
          <p className="section-subtitle-tech">
            Habilidades idiomáticas aplicadas al análisis de requerimientos, código y trabajo en equipo global.
          </p>
        </div>

        <motion.div 
          className="languages-stack"
          variants={languagesContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {languages.map((lang) => (
            <motion.article 
              key={lang.id} 
              className="language-card-tech"
              variants={languageCardVariants}
              style={{ '--card-accent': lang.accent }}
            >
              {/* Cabecera de Identidad con Cuadrado de Icono idéntico a Proyectos */}
              <div className="language-header-tech">
                <div 
                  className="language-icon-box"
                  style={{ 
                    backgroundColor: `${lang.accent}18`,
                    borderColor: `${lang.accent}40`,
                    color: lang.accent
                  }}
                >
                  <span className="language-flag-emoji">{lang.flag}</span>
                </div>
                <div className="language-title-area">
                  <h4 className="language-title-tech">{lang.name}</h4>
                  <div className="language-meta-tech">
                    <span className="language-role-badge" style={{ color: lang.accent }}>
                      {lang.level}
                    </span>
                    <span className="meta-separator">·</span>
                    <span className="language-meta-affiliation">{lang.affiliation}</span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <p className="language-desc-tech">{lang.description}</p>

              {/* Highlights de Competencia (Idéntico a Proyectos) */}
              <div className="language-highlights-grid">
                {lang.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="language-highlight-item">
                    <span className="language-highlight-icon" style={{ color: lang.accent }}>
                      {highlight.icon}
                    </span>
                    <span className="language-highlight-text">{highlight.text}</span>
                  </div>
                ))}
              </div>

              {/* Badges / Tags */}
              <div className="language-tags-tech">
                {lang.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="language-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
