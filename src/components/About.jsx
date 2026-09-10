import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section className="about section container" id="about">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Sobre <span className="text-gradient">Mí</span></h2>
        
        <div className="about-content">
          <div className="about-text">
            <p>
              Soy un desarrollador altamente sistemático, movido por la curiosidad y el deseo constante de entender cómo funcionan las cosas por debajo del capó. Me considero alguien que disfruta resolviendo problemas complejos de manera estructurada y eficiente.
            </p>
            <p>
              Mi enfoque siempre está en aprender y mejorar mis habilidades. Ya sea adentrándome en conceptos de bajo nivel o explorando las últimas tendencias en Inteligencia Artificial, mi objetivo es alcanzar la mejor versión de mí mismo en el ámbito profesional y aportar valor real a los proyectos en los que participo.
            </p>
          </div>
          <div className="about-stats">
            <div className="stat-box">
              <h3 className="stat-number">UTN</h3>
              <p className="stat-label">Ingeniería en Sistemas</p>
            </div>
            <div className="stat-box">
              <h3 className="stat-number">100%</h3>
              <p className="stat-label">Autodidacta Curioso</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
