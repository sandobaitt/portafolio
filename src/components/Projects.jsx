import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, Cpu, Sparkles, Layers, CheckCircle2, Terminal, BookOpen, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      id: "ccr-landing",
      title: "CCR Landing",
      role: "Frontend Developer",
      affiliation: "Proyecto Web Moderno",
      accent: "#ff6b00",
      icon: <Globe size={24} />,
      description: "Landing page institucional desarrollada con tecnologías web modernas, orientada a alta conversión y optimizada para rendimiento y métricas Core Web Vitals.",
      highlights: [
        {
          icon: <Sparkles size={16} />,
          text: "Optimización de Core Web Vitals (LCP < 1.2s, CLS 0) y carga ultra-veloz"
        },
        {
          icon: <Layers size={16} />,
          text: "Arquitectura Mobile-First con diseño 100% adaptable y fluido"
        },
        {
          icon: <CheckCircle2 size={16} />,
          text: "Micro-interacciones y transiciones sutiles con CSS moderno y sin sobrecarga"
        },
        {
          icon: <Zap size={16} />,
          text: "Estructura modular de componentes y pipeline de despliegue continuo"
        }
      ],
      tags: ["React", "JavaScript", "CSS3 Moderno", "Vite", "Responsive UI"],
      githubUrl: "https://github.com/sandobaitt/ccr-landing"
    },
    {
      id: "repulsor",
      title: "Sistema Dinámico Repulsor",
      role: "Backend & Lógica OOP",
      affiliation: "UTN FRRE · Paradigmas de Programación",
      accent: "#6366f1",
      icon: <Zap size={24} />,
      description: "Simulador y motor de sistemas dinámicos desarrollado en Smalltalk, modelando campos de fuerzas repulsoras, física vectorial y estados de partículas concurrentes.",
      highlights: [
        {
          icon: <Layers size={16} />,
          text: "Modelado orientado a objetos puro bajo entorno Smalltalk (Cuis / Pharo)"
        },
        {
          icon: <Zap size={16} />,
          text: "Simulación vectorial de fuerzas físicas y campos repulsores en tiempo real"
        },
        {
          icon: <CheckCircle2 size={16} />,
          text: "Patrones de diseño (Strategy, Observer) para desacople del motor físico"
        },
        {
          icon: <Terminal size={16} />,
          text: "Visualización gráfica interactiva de trayectorias, estados y colisiones"
        }
      ],
      tags: ["Smalltalk", "OOP Puro", "Simulación Física", "Design Patterns", "Cuis Smalltalk"],
      githubUrl: "https://github.com/sandobaitt/TPI-Paradigmas-"
    },
    {
      id: "assembler",
      title: "Guía de Assembler x86",
      role: "Low-Level Architecture",
      affiliation: "UTN FRRE · Arquitectura de Computadoras",
      accent: "#10b981",
      icon: <Cpu size={24} />,
      description: "Documentación técnica, manual de referencia y compendio de ejercicios prácticos resueltos para la cátedra de Arquitectura de Computadoras en UTN FRRE.",
      highlights: [
        {
          icon: <Cpu size={16} />,
          text: "Arquitectura x86 / 8086: manipulación de registros y segmentación de memoria"
        },
        {
          icon: <Terminal size={16} />,
          text: "Implementación de rutinas de interrupción de software (BIOS & DOS 10h/21h)"
        },
        {
          icon: <CheckCircle2 size={16} />,
          text: "Aritmética binaria, manipulación de bits, flags de estado y stack frames"
        },
        {
          icon: <BookOpen size={16} />,
          text: "Recurso de estudio estructurado adoptado por alumnos de la facultad"
        }
      ],
      tags: ["Assembler x86", "8086 Architecture", "DOS Interrupts", "Memory Segmentation", "Emu8086"],
      githubUrl: "https://github.com/sandobaitt/Assembler"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.18 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
  };

  return (
    <section className="projects section container" id="projects">
      <div className="section-header-tech">
        <div className="section-badge-tech">
          <FolderGit2 size={15} />
          <span>Experiencia y Proyectos</span>
        </div>
        <h2 className="section-title">
          Proyectos <span className="text-gradient">Destacados</span>
        </h2>
        <p className="section-subtitle-tech">
          Desarrollos enfocados en arquitectura sólida, rendimiento y código limpio.
        </p>
      </div>

      <motion.div 
        className="projects-stack"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {projects.map((project) => (
          <motion.article 
            key={project.id} 
            className="project-card-tech" 
            variants={cardVariants}
            style={{ '--card-accent': project.accent }}
          >
            {/* Cabecera de Identidad */}
            <div className="project-header-tech">
              <div 
                className="project-icon-box" 
                style={{ 
                  backgroundColor: `${project.accent}18`,
                  borderColor: `${project.accent}40`,
                  color: project.accent
                }}
              >
                {project.icon}
              </div>
              <div className="project-title-area">
                <h3 className="project-title-tech">{project.title}</h3>
                <div className="project-meta-tech">
                  <span className="project-role-badge" style={{ color: project.accent }}>
                    {project.role}
                  </span>
                  <span className="meta-separator">·</span>
                  <span className="project-meta-affiliation">{project.affiliation}</span>
                </div>
              </div>
            </div>

            {/* Resumen */}
            <p className="project-desc-tech">{project.description}</p>

            {/* Technical Highlights Checklist */}
            <div className="project-highlights-grid">
              {project.highlights.map((highlight, hIdx) => (
                <div key={hIdx} className="project-highlight-item">
                  <span className="highlight-icon" style={{ color: project.accent }}>
                    {highlight.icon}
                  </span>
                  <span className="highlight-text">{highlight.text}</span>
                </div>
              ))}
            </div>

            {/* Tech Tags */}
            <div className="project-tags-tech">
              {project.tags.map((tag, tIdx) => (
                <span key={tIdx} className="project-tag-pill">
                  {tag}
                </span>
              ))}
            </div>

            {/* Enlaces de Acción */}
            <div className="project-actions-tech">
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-action-btn"
                aria-label={`Ver repositorio de ${project.title}`}
              >
                <FaGithub size={16} />
                <span>Ver Repositorio</span>
                <ArrowUpRight size={14} className="action-arrow" />
              </a>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <motion.div 
        className="more-projects"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <a 
          href="https://github.com/sandobaitt" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-sleek"
        >
          Explorar todos los repositorios en GitHub <span>→</span>
        </a>
      </motion.div>
    </section>
  );
};

export default Projects;
