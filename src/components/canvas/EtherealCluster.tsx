'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// SMOOTH GRADIENT COLOR SYSTEM
const getGradientColor = (position: [number, number, number]) => {
  const [x, y, z] = position;
  const distance = Math.sqrt(x * x + y * y + z * z);
  const angle = Math.atan2(y, x);
  const normalizedAngle = (angle + Math.PI) / (Math.PI * 2);
  
  // Smooth color interpolation based on position
  const colorStops = [
    { pos: 0.0, color: "#FF1493", emissive: "#FF1493" },    // Deep Pink
    { pos: 0.2, color: "#FF69B4", emissive: "#FF69B4" },    // Hot Pink
    { pos: 0.4, color: "#FF69B4", emissive: "#FF69B4" },    // Hot Pink
    { pos: 0.6, color: "#8A2BE2", emissive: "#8A2BE2" },    // Blue Violet
    { pos: 0.8, color: "#00CED1", emissive: "#00CED1" },    // Dark Turquoise
    { pos: 1.0, color: "#FF1493", emissive: "#FF1493" }     // Back to Pink
  ];
  
  // Find interpolation points
  const scaledAngle = normalizedAngle * (colorStops.length - 1);
  const lowerIndex = Math.floor(scaledAngle);
  const upperIndex = Math.ceil(scaledAngle);
  const t = scaledAngle - lowerIndex;
  
  const lower = colorStops[lowerIndex];
  const upper = colorStops[upperIndex];
  
  // Interpolate colors
  const interpolateColor = (color1: string, color2: string, t: number) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  const color = interpolateColor(lower.color, upper.color, t);
  const emissive = interpolateColor(lower.emissive, upper.emissive, t);
  
  // Opacity based on distance from center (closer = more opaque)
  const maxDistance = 3.5;
  const normalizedDistance = Math.min(distance / maxDistance, 1);
  const opacity = 0.3 + (1 - normalizedDistance) * 0.4; // 0.3 to 0.7
  
  return { color, emissive, opacity };
};

// DENSE ORGANIC BUBBLE CLUSTER
export default function EtherealCluster() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // DENSE ORGANIC BUBBLE GENERATION
  const generateDenseBubbles = () => {
    const bubbles: Array<{
      pos: [number, number, number];
      radius: number;
      phase: number;
    }> = [];
    
    const clusterRadius = 2.8;  // Overall cluster size
    const bubbleCount = 30;     // Further reduced for software rendering
    
    // Generate bubbles with organic distribution
    for (let i = 0; i < bubbleCount; i++) {
      // Use spherical coordinates with noise for organic distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 1/3) * clusterRadius; // Concentrated towards center
      
      // Add noise for organic shape
      const noiseX = (Math.random() - 0.5) * 0.8;
      const noiseY = (Math.random() - 0.5) * 0.8;
      const noiseZ = (Math.random() - 0.5) * 0.8;
      
      const x = r * Math.sin(phi) * Math.cos(theta) + noiseX;
      const y = r * Math.sin(phi) * Math.sin(theta) + noiseY;
      const z = r * Math.cos(phi) + noiseZ;
      
      // Gradual size variation (no distinct tiers)
      const sizeVariation = Math.random();
      let radius;
      if (sizeVariation < 0.1) {
        radius = 0.8 + Math.random() * 0.6;  // Large bubbles (10%)
      } else if (sizeVariation < 0.4) {
        radius = 0.4 + Math.random() * 0.4;  // Medium bubbles (30%)
      } else {
        radius = 0.1 + Math.random() * 0.3;  // Small bubbles (60%)
      }
      
      bubbles.push({
        pos: [x, y, z],
        radius,
        phase: i * 0.1
      });
    }
    
    return bubbles;
  };

  const bubbleData = generateDenseBubbles();

  useFrame(() => {
    timeRef.current += 0.003;
    
    if (groupRef.current) {
      // Gentle overall cluster movement
      groupRef.current.rotation.y = timeRef.current * 0.05;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.02) * 0.1;
      groupRef.current.position.y = Math.sin(timeRef.current * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {bubbleData.map((bubble, index) => (
        <Bubble
          key={index}
          position={bubble.pos}
          radius={bubble.radius}
          phase={bubble.phase}
          timeRef={timeRef}
        />
      ))}
    </group>
  );
}

// Individual Bubble Component with organic movement and enhanced materials
function Bubble({ position, radius, phase, timeRef }: {
  position: [number, number, number];
  radius: number;
  phase: number;
  timeRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorData = getGradientColor(position);

  useFrame(() => {
    if (meshRef.current) {
      const time = timeRef.current;
      
      // ORGANIC FLOATING MOVEMENT
      const [x, y, z] = position;
      const floatX = Math.sin(time * 0.3 + phase) * 0.02;
      const floatY = Math.cos(time * 0.25 + phase * 1.2) * 0.03;
      const floatZ = Math.sin(time * 0.2 + phase * 0.8) * 0.015;
      
      meshRef.current.position.x = x + floatX;
      meshRef.current.position.y = y + floatY;
      meshRef.current.position.z = z + floatZ;
      
      // Gentle rotation
      meshRef.current.rotation.x = time * 0.02 + phase;
      meshRef.current.rotation.y = time * 0.03 + phase * 0.5;
      meshRef.current.rotation.z = time * 0.01 + phase * 0.3;
      
      // Subtle breathing effect
      const scale = 1 + Math.sin(time * 0.5 + phase) * 0.02;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <Sphere args={[radius, 8, 8]}>
        <MeshTransmissionMaterial
          transmission={0.5}
          thickness={0.3}
          roughness={0.1}
          chromaticAberration={0.05}
          ior={1.4}
          color={colorData.color}
          transparent={true}
          opacity={colorData.opacity}
          emissive={colorData.emissive}
          emissiveIntensity={0.3}
          iridescence={0.5}
          iridescenceIOR={1.8}
          iridescenceThicknessRange={[100, 400]}
          clearcoat={0.7}
          clearcoatRoughness={0.1}
          metalness={0.0}
          envMapIntensity={0.8}
        />
      </Sphere>
    </mesh>
  );
}
