import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle2, Terminal, Code2, Database } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero section container" id="home">
      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-profile-row">
          <img src="/profile.jpeg" alt="Lautaro E. Sandoval" className="hero-avatar" />
          <h1 className="hero-name">
            Lautaro E. Sandoval 
            <CheckCircle2 className="verified-badge" size={24} />
          </h1>
        </div>
        
        <h3 className="hero-role">
          <span className="text-gradient">Estudiante de Ingeniería en Sistemas</span> — Fullstack Developer
        </h3>
        
        <p className="hero-description">
          Apasionado por la ciberseguridad, el desarrollo de software y la inteligencia artificial. Siempre construyendo la mejor versión de mí. 
          Desarrollando soluciones con <span className="inline-badge"><Code2 size={14}/> React</span>, <span className="inline-badge"><Terminal size={14}/> Bash</span> y <span className="inline-badge"><Database size={14}/> SQL</span>.
        </p>
        
        <div className="hero-cta">
          <a href="#projects" className="btn-sleek">Ver Proyectos <span>↗</span></a>
          <a href="#contact" className="btn-sleek-secondary">Contactar <span>→</span></a>
        </div>
      </motion.div>

      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <ArrowDown size={24} className="bounce" />
      </motion.div>
    </section>
  );
};

export default Hero;
