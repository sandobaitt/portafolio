import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Terminal, GitBranch, Braces, TerminalSquare, Box, Layers } from 'lucide-react';
import { FaReact, FaPython, FaLinux, FaGithub, FaReacteurope } from 'react-icons/fa';
import { SiCplusplus, SiC, SiJavascript, SiMysql, SiGnubash, SiFramer } from 'react-icons/si';
import './Skills.css';

const Skills = () => {
  const allSkills = [
    { name: "React", icon: <FaReact /> },
    { name: "JavaScript", icon: <SiJavascript /> },
    { name: "Python", icon: <FaPython /> },
    { name: "C++", icon: <SiCplusplus /> },
    { name: "C", icon: <SiC /> },
    { name: "Linux", icon: <FaLinux /> },
    { name: "Bash", icon: <SiGnubash /> },
    { name: "Terminal", icon: <TerminalSquare /> },
    { name: "MySQL", icon: <SiMysql /> },
    { name: "SQL", icon: <Database /> },
    { name: "Git", icon: <GitBranch /> },
    { name: "GitHub", icon: <FaGithub /> },
    { name: "Framer Motion", icon: <SiFramer /> }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <section className="skills section container" id="skills">
      <h2 className="section-title">Tecnologías & <span className="text-gradient">Herramientas</span></h2>
      
      <motion.div 
        className="tech-pill-cloud"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {allSkills.map((skill, index) => (
          <motion.div key={index} className="tech-pill" variants={item}>
            <span className="tech-pill-icon">{skill.icon}</span>
            <span className="tech-pill-name">{skill.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Skills;
