import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle2, MapPin, Mail } from 'lucide-react';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
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
        <div className="hero-location-tag">
          <MapPin size={14} />
          <span>Resistencia, Chaco, Argentina</span>
        </div>

        <div className="hero-profile-row">
          <img src="/profile.jpeg" alt="Lautaro E. Sandoval" className="hero-avatar" />
          <div className="hero-title-group">
            <h1 className="hero-name">
              Lautaro E. Sandoval 
              <CheckCircle2 className="verified-badge" size={24} />
            </h1>
            
            {/* Contactos rápidos integrados en el Hero */}
            <div className="hero-quick-contacts">
              <a 
                href="mailto:lautaroemanuelsandoval@gmail.com" 
                className="hero-contact-icon-btn" 
                aria-label="Email directo"
                title="Email: lautaroemanuelsandoval@gmail.com"
              >
                <Mail size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/lautarosandoval" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hero-contact-icon-btn" 
                aria-label="Perfil de LinkedIn"
                title="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a 
                href="https://github.com/sandobaitt" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hero-contact-icon-btn" 
                aria-label="Perfil de GitHub"
                title="GitHub"
              >
                <FaGithub size={18} />
              </a>
              <a 
                href="https://instagram.com/lautisando_" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hero-contact-icon-btn" 
                aria-label="Instagram"
                title="Instagram"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <h3 className="hero-role">
          <span className="text-gradient">Estudiante de Ingeniería en Sistemas</span> — Fullstack Developer
        </h3>
        
        <p className="hero-description">
          Desarrollando soluciones de software con foco en arquitectura, rendimiento y código limpio. Formándome continuamente en desarrollo web moderno, sistemas y algoritmos.
        </p>
        
        {/* Acciones principales en el Hero */}
        <div className="hero-cta">
          <a href="#projects" className="btn-sleek">Ver Proyectos <span>↗</span></a>
          <a href="mailto:lautaroemanuelsandoval@gmail.com" className="btn-sleek-secondary">
            <Mail size={16} />
            <span>Escríbeme un Correo</span>
          </a>
        </div>
      </motion.div>

      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <ArrowDown size={22} className="bounce" />
      </motion.div>
    </section>
  );
};

export default Hero;
