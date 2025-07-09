"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => { 
      setIsMobile(window.innerWidth <= 768); 
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => { 
      window.removeEventListener("resize", checkMobile); 
    };
  }, []);

  const scaleDimensions = () => { 
    return isMobile ? [0.7, 0.9] : [1.05, 1]; 
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  return (
    <div
      className="h-[70rem] md:h-[80rem] flex items-center justify-center relative"
      ref={containerRef}
    >
      <div className="py-10 md:py-20 w-full relative" style={{ perspective: "1200px" }}>
        <Header translate={translate} titleComponent={titleComponent} opacity={opacity} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ 
  translate, 
  titleComponent, 
  opacity 
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
  opacity: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{ 
        translateY: translate,
        opacity: opacity
      }}
      className="max-w-6xl mx-auto text-center px-4 md:px-6"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  const brandColorRgb = "5, 83, 243";
  
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        translateY: translate,
      }}
      className="max-w-6xl -mt-12 mx-auto h-[35rem] md:h-[45rem] w-full relative"
    >
      {/* Outer glow container */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(${brandColorRgb}, 0.15) 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      
      {/* Main card container */}
      <div 
        className="relative h-full w-full border border-white/10 p-3 md:p-6 rounded-3xl shadow-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, 
            rgba(8, 13, 27, 0.95) 0%, 
            rgba(12, 18, 35, 0.9) 50%, 
            rgba(8, 13, 27, 0.95) 100%)`,
          backdropFilter: "blur(10px)",
          boxShadow: `
            0 0 40px -10px rgba(${brandColorRgb}, 0.3),
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
        }}
      >
        {/* Inner border highlight */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, 
              rgba(${brandColorRgb}, 0.1) 0%, 
              transparent 50%, 
              rgba(${brandColorRgb}, 0.05) 100%)`,
          }}
        />
        
        {/* Content container */}
        <div className="h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 relative">
          {/* Subtle inner glow */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(${brandColorRgb}, 0.1) 0%, transparent 50%)`,
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 h-full">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};