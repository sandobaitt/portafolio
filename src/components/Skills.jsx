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
  Sparkles
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

  // Idiomas
  const languages = [
    {
      name: "Español",
      level: "Nativo / Lengua Materna",
      flag: "🇦🇷",
      description: "Dominio completo y natural. Excelente capacidad de redacción técnica y comunicación estructurada."
    },
    {
      name: "Inglés",
      level: "Técnico Profesional (B1 / B2)",
      flag: "🇺🇸",
      description: "Lectura fluida de documentación técnica, especificaciones de arquitectura y comunicación escrita en entornos de desarrollo."
    }
  ];

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

      {/* Apartado de Idiomas */}
      <motion.div 
        className="languages-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="languages-header">
          <div className="section-badge-tech">
            <Languages size={15} />
            <span>Comunicación</span>
          </div>
          <h3 className="languages-section-title">
            Idiomas
          </h3>
        </div>

        <div className="languages-grid">
          {languages.map((lang, index) => (
            <div key={index} className="language-card">
              <div className="language-card-header">
                <span className="language-flag">{lang.flag}</span>
                <div>
                  <h4 className="language-name">{lang.name}</h4>
                  <span className="language-level-badge">{lang.level}</span>
                </div>
              </div>
              <p className="language-desc">{lang.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;
