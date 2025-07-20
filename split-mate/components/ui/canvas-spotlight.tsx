"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  children?: React.ReactNode;
  animationSpeed?: number;
  containerClassName?: string;
}

export function CanvasRevealEffect({
  children,
  animationSpeed = 4,
  containerClassName,
}: Props) {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden rounded-2xl ${containerClassName}`}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={1.5}
        camera={{ position: [0, 0, 5], fov: 15 }}
      >
        <RevealingMesh animationSpeed={animationSpeed} />
      </Canvas>
      {children}
    </div>
  );
}

function RevealingMesh({ animationSpeed }: { animationSpeed: number }) {
  const meshRef = React.useRef<THREE.Mesh>(null!);
  const clock = React.useRef(new THREE.Clock());

  useFrame(() => {
    if (meshRef.current) {
      const elapsedTime = clock.current.getElapsedTime();
      meshRef.current.rotation.x = elapsedTime / animationSpeed;
      meshRef.current.rotation.y = elapsedTime / animationSpeed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.5, 0.3, 128, 32]} />
      <meshStandardMaterial color={"#1e40af"} wireframe />
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
    </mesh>
  );
}
