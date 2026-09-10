import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, BookOpen } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { GitHubCalendar } from 'react-github-calendar';
import './GithubActivity.css';

const GithubActivity = () => {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    fetch('https://api.github.com/users/sandobaitt')
      .then(res => res.json())
      .then(data => {
        if(!data.message) {
          setProfile(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="github section container" id="github">
      <h2 className="section-title">Actividad en <span className="text-gradient">GitHub</span></h2>
      
      <motion.div 
        className="github-container-sleek"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="github-header-sleek">
          <div className="github-profile-sleek">
            <img src={profile?.avatar_url || "https://github.com/sandobaitt.png"} alt="GitHub Avatar" className="github-avatar-sleek" />
            <div className="github-info-sleek">
              <h3>{profile?.name || "Lautaro Sandoval"}</h3>
              <a href="https://github.com/sandobaitt" target="_blank" rel="noopener noreferrer" className="github-username-sleek">
                @sandobaitt
              </a>
            </div>
          </div>
          
          <div className="github-stats-sleek">
            <div className="g-stat-sleek">
              <BookOpen size={18} />
              <span>{profile?.public_repos || "10+"} Repos</span>
            </div>
            <a href="https://github.com/sandobaitt" target="_blank" rel="noopener noreferrer" className="btn-sleek">
              Seguir en GitHub <span>↗</span>
            </a>
          </div>
        </div>

        <div className="github-calendar-wrapper">
          <GitHubCalendar 
            username="sandobaitt" 
            colorScheme="dark"
            theme={{
              light: ['#ebedf0', '#FFD1B3', '#FF9F66', '#FF6A00', '#CC5500'],
              dark: ['#292524', '#7A2E00', '#B34400', '#E65C00', '#FF6A00']
            }}
            labels={{
              totalCount: '{{count}} contribuciones en el último año',
            }}
            blockSize={12}
            blockMargin={4}
            fontSize={12}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default GithubActivity;
