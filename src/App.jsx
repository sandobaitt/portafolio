import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import GithubActivity from './components/GithubActivity';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Antigravity from './components/Antigravity';
import './components/ParticleBackground.css';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="particle-background">
        <Antigravity
          count={700}
          magnetRadius={8}
          ringRadius={7}
          waveSpeed={5}
          waveAmplitude={5}
          particleSize={2}
          lerpSpeed={0.01}
          color={'#FF5500'}
          autoAnimate={true}
          particleVariance={0}
          depthFactor={5}
          pulseSpeed={10}
          fieldStrength={20}
        />
      </div>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GithubActivity />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
