"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { CanvasRevealEffect } from "./canvas-spotlight";

interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color?: string;
  radius?: number;
}

export function CardSpotlight({
  children,
  className,
  color = "#ffffff",
  radius = 350,
  ...props
}: CardSpotlightProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!card || !spotlight) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spotlight.style.background = `radial-gradient(${radius}px circle at ${x}px ${y}px, ${color}, transparent 40%)`;
    spotlight.style.opacity = "1";
  }

  function handleMouseLeave() {
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative group bg-black text-white overflow-hidden", className)}
      {...props}
    >
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0"
      />
      <CanvasRevealEffect animationSpeed={5} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
