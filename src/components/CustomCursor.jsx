import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // The dot follows instantly
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      
      if (isHidden) setIsHidden(false);
    };

    const animate = () => {
      // The ring has a smooth trailing effect
      const distX = mouseX - cursorX;
      const distY = mouseY - cursorY;
      cursorX += distX * 0.15; // easing factor
      cursorY += distY * 0.15;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      
      requestAnimationFrame(animate);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    
    // Hide when mouse leaves window
    const onMouseLeave = () => setIsHidden(true);
    const onMouseEnter = () => setIsHidden(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Track hover on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"]');
      if (isInteractive) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);

    const reqId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(reqId);
    };
  }, [isHidden]);

  return (
    <>
      <div 
        ref={cursorRef} 
        className={`custom-cursor-ring ${isHidden ? 'hidden' : ''} ${isHovering ? 'hover' : ''} ${isClicked ? 'clicked' : ''}`}
      />
      <div 
        ref={cursorDotRef} 
        className={`custom-cursor-dot ${isHidden ? 'hidden' : ''} ${isHovering ? 'hover' : ''} ${isClicked ? 'clicked' : ''}`}
      />
    </>
  );
};

export default CustomCursor;
