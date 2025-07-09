"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface GridBackgroundProps {
  height?: string;
  intensity?: number;
  animated?: boolean;
  className?: string;
}

export default function GridBackground({ 
  height = "30rem", 
  intensity = 0.1, 
  animated = true,
  className = ""
}: GridBackgroundProps) {
  const brandColorRgb = "5, 83, 243";
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const spotlightY = useTransform(scrollYProgress, [0, 1], ["60%", "30%"]);
  
  // Mouse tracking for interactive spotlight
  useEffect(() => {
    if (!animated) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [animated]);

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale }}
      className={`relative w-full flex items-center justify-center -my-32 overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Main spotlight effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% ${spotlightY}, rgba(${brandColorRgb}, ${intensity}), transparent)`,
        }}
      />
      
      {/* Interactive mouse spotlight */}
      {animated && (
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: `radial-gradient(circle 200px at ${mousePosition.x}% ${mousePosition.y}%, rgba(${brandColorRgb}, ${intensity * 0.5}), transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Enhanced grid with multiple layers */}
      <div className="absolute inset-0 h-full w-full">
        {/* Primary grid */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Main grid pattern */}
            <pattern
              id="primary-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              x="50%"
              y="50%"
              patternTransform="translate(-20 -20)"
            >
              <path
                d="M0 -20V20M-20 0H20"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
            
            {/* Secondary finer grid */}
            <pattern
              id="secondary-grid"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              x="50%"
              y="50%"
              patternTransform="translate(-4 -4)"
            >
              <path
                d="M0 -4V4M-4 0H4"
                stroke="rgba(255, 255, 255, 0.02)"
                strokeWidth="0.25"
                fill="none"
              />
            </pattern>
            
            {/* Animated gradient for grid enhancement */}
            <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={`rgba(${brandColorRgb}, 0.1)`} />
              <stop offset="50%" stopColor="transparent" />
              <stop offset="100%" stopColor={`rgba(${brandColorRgb}, 0.05)`} />
            </linearGradient>
          </defs>
          
          {/* Render grids */}
          <rect width="100%" height="100%" fill="url(#secondary-grid)" />
          <rect width="100%" height="100%" fill="url(#primary-grid)" />
          
          {/* Animated accent lines */}
          {animated && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <line
                x1="0%"
                y1="40%"
                x2="100%"
                y2="40%"
                stroke={`rgba(${brandColorRgb}, 0.2)`}
                strokeWidth="1"
                strokeDasharray="20,10"
              />
              <line
                x1="30%"
                y1="0%"
                x2="30%"
                y2="100%"
                stroke={`rgba(${brandColorRgb}, 0.15)`}
                strokeWidth="0.5"
                strokeDasharray="15,5"
              />
            </motion.g>
          )}
        </svg>
      </div>
      
      {/* Floating particles for enhanced tech feel */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: `rgba(${brandColorRgb}, 0.4)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
      
      {/* Edge fade effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030815] via-transparent to-[#030815] opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030815] via-transparent to-[#030815] opacity-40" />
      
      {/* Central glow enhancement */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(circle 300px at 50% 50%, rgba(${brandColorRgb}, 0.02), transparent)`,
        }}
      />
    </motion.div>
  );
}