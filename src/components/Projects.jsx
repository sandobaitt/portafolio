import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaReact, FaCss3Alt } from 'react-icons/fa';
import { SiJavascript, SiHtml5 } from 'react-icons/si';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: "CCR Landing",
      role: "Frontend Developer",
      description: "Landing page desarrollada con tecnologías web modernas, enfocada en rendimiento y diseño responsivo.",
      techIcons: [<FaReact key="react"/>, <FaCss3Alt key="css"/>, <SiJavascript key="js"/>],
      githubUrl: "https://github.com/sandobaitt/ccr-landing"
    },
    {
      title: "Sistema Dinámico Repulsor",
      role: "Backend & Logic",
      description: "TPI Paradigmas - Simulador y sistema dinámico desarrollado en SmallTalk.",
      techIcons: [<span key="st" className="text-sm font-bold">ST</span>], // Placeholder text for SmallTalk
      githubUrl: "https://github.com/sandobaitt/TPI-Paradigmas-"
    },
    {
      title: "Guía de Assembler",
      role: "Low Level Architecture",
      description: "Documentación y ejercicios prácticos de Assembler para la materia de Arquitectura de Computadoras en UTN FRRE.",
      techIcons: [<span key="asm" className="text-sm font-bold">ASM</span>],
      githubUrl: "https://github.com/sandobaitt/Assembler"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="projects section container" id="projects">
      <h2 className="section-title">Proyectos <span className="text-gradient">Destacados</span></h2>
      
      <motion.div 
        className="projects-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {projects.map((project, index) => (
          <motion.div key={index} className="project-card-sleek" variants={item}>
            <div className="project-content-sleek">
              <h3 className="project-title-sleek">{project.title}</h3>
              <span className="project-role-sleek">{project.role}</span>
              <p className="project-desc-sleek">{project.description}</p>
            </div>
            
            <div className="project-footer-sleek">
              <div className="project-tech-icons">
                {project.techIcons}
              </div>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link-sleek">
                VER CÓDIGO ↗
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="more-projects"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <a href="https://github.com/sandobaitt" target="_blank" rel="noopener noreferrer" className="btn-sleek">
          Explorar más en GitHub <span>→</span>
        </a>
      </motion.div>
    </section>
  );
};

export default Projects;
