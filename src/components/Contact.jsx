import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact section container" id="contact">
      <motion.div
        className="contact-content"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Contáctame</h2>
        <p className="contact-text">
          ¿Tienes algún proyecto en mente o simplemente quieres saludar? 
          Mis bandejas de entrada están siempre abiertas.
        </p>

        <div className="contact-links-compact">
          <a href="mailto:llautaroemanuelsandoval@gmail.com" className="contact-icon-btn" aria-label="Email">
            <Mail size={24} />
            <span>Email</span>
          </a>
          <a href="https://www.linkedin.com/in/lautarosandoval" target="_blank" rel="noopener noreferrer" className="contact-icon-btn" aria-label="LinkedIn">
            <FaLinkedin size={24} />
            <span>LinkedIn</span>
          </a>
          <a href="https://instagram.com/lautisando_" target="_blank" rel="noopener noreferrer" className="contact-icon-btn" aria-label="Instagram">
            <FaInstagram size={24} />
            <span>Instagram</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
