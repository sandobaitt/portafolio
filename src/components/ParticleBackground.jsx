import React, { useRef, useEffect } from 'react';
import './ParticleBackground.css';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Configuración inicial del Canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    
    const mouse = {
      x: null,
      y: null,
      radius: 120 // Radio mucho más discreto
    };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    
    const handleMouseClick = () => {
      if (mouse.x == null || mouse.y == null) return;
      // Explosión de partículas (emulando la física de click del ejemplo)
      particles.forEach(p => {
        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius * 3) { // Radio de explosión más amplio
          // Aplicar una velocidad aleatoria fuerte alejándose del centro del clic
          let angle = Math.atan2(dy, dx);
          let velocity = (Math.random() * 80) + 40; // velocidad de explosión
          p.vx += Math.cos(angle) * velocity;
          p.vy += Math.sin(angle) * velocity;
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleMouseClick);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };
    
    window.addEventListener('resize', handleResize);
    
    class Particle {
      constructor(x, y, radius, angle) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        
        // Para físicas elásticas
        this.vx = 0;
        this.vy = 0;

        this.density = (Math.random() * 20) + 5;
        this.baseAngle = angle;
        
        // Orientación tangencial inicial
        this.drawAngle = angle + Math.PI / 2; 
        
        this.distanceFromCenter = radius;
        // Colores más brillantes y uniformes, con menor atenuación
        this.baseOpacity = Math.max(0.4, 1 - (radius / (Math.max(canvas.width, canvas.height))));
        this.currentOpacity = this.baseOpacity;
      }
      
      draw() {
        // Usamos el color de acento del portafolio (azul),
        // ajustando la opacidad según las ondas
        ctx.fillStyle = `rgba(66, 133, 244, ${this.currentOpacity})`; 
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.drawAngle);
        
        // Forma de pastilla / dash normal
        let length = 10;
        const width = 2.0;
        
        // Si el ratón está cerca, se acortan a puntitos para dar un efecto de interacción
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distanceToMouse = Math.sqrt(dx * dx + dy * dy);
          if (distanceToMouse < mouse.radius * 1.5) {
             let lengthFactor = distanceToMouse / (mouse.radius * 1.5);
             length = 2 + (8 * lengthFactor); 
          }
        }
        
        ctx.roundRect(-length/2, -width/2, length, width, 2);
        ctx.fill();
        ctx.restore();
      }
      
      update(time, wanderX, wanderY) {
        // Ondas 2D más orgánicas (tipo agua o viento)
        let waveSineX = Math.sin(time * 0.8 + this.baseX * 0.005 + this.baseY * 0.005);
        let waveSineY = Math.cos(time * 0.9 + this.baseX * 0.005 - this.baseY * 0.005);
        
        let waveOffsetX = waveSineX * 18;
        let waveOffsetY = waveSineY * 18;
        
        // La opacidad varía de manera suave y orgánica con la onda principal
        this.currentOpacity = Math.max(0.4, Math.min(1.0, this.baseOpacity + waveSineX * 0.6));

        let currentBaseX = this.baseX + waveOffsetX + wanderX;
        let currentBaseY = this.baseY + waveOffsetY + wanderY;

        let targetX = currentBaseX;
        let targetY = currentBaseY;
        
        // El ángulo también tiene un ligero bamboleo orgánico
        let targetAngle = this.baseAngle + Math.PI / 2 + (waveSineX * 0.3);
        
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - currentBaseX;
          let dy = mouse.y - currentBaseY;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          let pull_distance = mouse.radius; // 120
          
          if (distance < pull_distance) {
            // Calculamos el porcentaje de distancia
            let percent = distance / pull_distance;
            
            // Limitamos fuertemente la cantidad de movimiento para que solo sea una atracción sutil
            // y no deje un hueco enorme (multiplicamos el efecto por 0.15)
            targetX = currentBaseX + dx * (percent * 0.15);
            targetY = currentBaseY + dy * (percent * 0.15);
            
            // Reorientar dinámicamente alejándose del mouse
            let escapeAngle = Math.atan2(-dy, -dx); 
            let angleDiff = escapeAngle - targetAngle;
            
            // Normalizar diferencia de ángulo
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            let force = (pull_distance - distance) / pull_distance;
            targetAngle += angleDiff * (force * 0.8);
            
            // Las partículas se vuelven más brillantes cuando interactúan
            this.currentOpacity = Math.min(1.0, this.currentOpacity + force * 0.5);
          }
        }
        
        // FÍSICA ELÁSTICA (Reemplaza el ease: "elastic.out(1, 0.3)" de GSAP)
        const k = 0.15; // Fuerza del resorte (spring constant)
        const damp = 0.70; // Fricción (0.70 crea un rebote elástico agradable)
        
        let dx = targetX - this.x;
        let dy = targetY - this.y;
        
        this.vx += dx * k;
        this.vy += dy * k;
        
        this.vx *= damp;
        this.vy *= damp;
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Suavizar la rotación hacia el targetAngle
        let diff = targetAngle - this.drawAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.drawAngle += diff * 0.15;
      }
    }
    
    function init() {
      particles = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.7; // No ocupa toda la pantalla, es una forma irregular
      
      // Anillos más concentrados en el centro, más espaciados en los bordes
      for (let radius = 20; radius < maxRadius; radius += 35) {
        const circumference = 2 * Math.PI * radius;
        const numParticles = Math.floor(circumference / 35); // Menos densidad, dashes más limpios
        
        for (let i = 0; i < numParticles; i++) {
          // Dejamos huecos al azar para que sea una forma irregular, no un círculo perfecto
          if (Math.random() > 0.85) continue; 
          
          const angle = (i / numParticles) * Math.PI * 2;
          const jitter = (Math.random() - 0.5) * 15; // Mayor jitter para irregularidad
          const x = centerX + Math.cos(angle) * (radius + jitter);
          const y = centerY + Math.sin(angle) * (radius + jitter);
          
          particles.push(new Particle(x, y, radius, angle));
        }
      }
    }
    
    let time = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.015; // Velocidad de la marea tranquila
      
      // Paseo de la masa de partículas (Wander)
      let wanderX = Math.sin(time * 0.2) * (canvas.width * 0.15);
      let wanderY = Math.cos(time * 0.15) * (canvas.height * 0.15);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(time, wanderX, wanderY);
        particles[i].draw();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    init();
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-background" />;
};

export default ParticleBackground;
