'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Text, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ProcessContainerProps {
  onDropThought?: (thought: string) => void;
  onDragOver?: (isOver: boolean) => void;
}

export default function ProcessContainer({ onDropThought, onDragOver }: ProcessContainerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const textRef = useRef<THREE.Group>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // Animation state
  const timeRef = useRef(0);
  const baseIntensity = 2;
  const baseScale = 1;

  useFrame(() => {
    timeRef.current += 0.01;
    
    // Pulsating light intensity
    if (lightRef.current) {
      const pulseIntensity = baseIntensity + Math.sin(timeRef.current * 2) * 0.5;
      lightRef.current.intensity = isHovered ? pulseIntensity * 1.5 : pulseIntensity;
      
      // Color shift on hover
      if (isHovered) {
        const hue = (timeRef.current * 0.5) % 1;
        lightRef.current.color.setHSL(hue, 0.8, 0.6);
      } else {
        lightRef.current.color.setHex(0x8a2be2);
      }
    }
    
    // Container scale animation
    if (meshRef.current) {
      const targetScale = isDraggingOver ? 1.1 : baseScale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Subtle rotation
      meshRef.current.rotation.y += 0.005;
    }
    
    // Text animation
    if (textRef.current) {
      const textPulse = 1 + Math.sin(timeRef.current * 3) * 0.05;
      textRef.current.scale.setScalar(textPulse);
      
      // Text color matching the light
      if (lightRef.current) {
        textRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.color.copy(lightRef.current!.color);
            child.material.opacity = 0.8;
          }
        });
      }
    }
  });

  const handlePointerOver = () => {
    setIsHovered(true);
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    setIsDraggingOver(false);
  };

  // Placeholder for future drag functionality
  const handleDragOver = () => {
    setIsDraggingOver(true);
    if (onDragOver) {
      onDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
    if (onDragOver) {
      onDragOver(false);
    }
  };

  // Placeholder for future drop functionality
  // const handleDrop = (thought: string) => {
  //   setIsDraggingOver(false);
  //   if (onDropThought) {
  //     onDropThought(thought);
  //   }
  //   if (onDragOver) {
  //     onDragOver(false);
  //   }
  // };

  return (
    <group>
      {/* Main Icosahedron Container */}
      <Icosahedron
        ref={meshRef}
        args={[2, 1]}
        position={[0, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <MeshTransmissionMaterial
          transmission={0.9}
          roughness={0.2}
          thickness={0.1}
          chromaticAberration={0.05}
          color={isDraggingOver ? '#00ffff' : '#4a004a'}
          emissive={isHovered ? '#8a2be2' : '#000000'}
          emissiveIntensity={isHovered ? 0.3 : 0}
        />
      </Icosahedron>
      
      {/* Internal Pulsating Light */}
      <pointLight
        ref={lightRef}
        color={0x8a2be2}
        intensity={baseIntensity}
        distance={5}
        position={[0, 0, 0]}
      />
      
      {/* 3D Text Label */}
      <Text
        ref={textRef}
        fontSize={0.8}
        position={[0, 0, 2.5]}
        rotation={[0, 0, 0]}
        color={0x8a2be2}
        anchorX="center"
        anchorY="middle"
      >
        Process
      </Text>
      
      {/* Invisible Interaction Zone */}
      <mesh
        position={[0, 0, 0]}
        onPointerOver={handleDragOver}
        onPointerOut={handleDragLeave}
      >
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Additional Glow Effect */}
      {isHovered && (
        <Icosahedron args={[2.2, 1]} position={[0, 0, 0]}>
          <meshBasicMaterial
            color={0x8a2be2}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Icosahedron>
      )}
    </group>
  );
}
