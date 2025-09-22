'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ThoughtProps {
  id: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  initialPosition: [number, number, number];
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, newPosition: [number, number, number]) => void;
  isProcessing?: boolean;
  isResolved?: boolean;
}

export default function Thought({
  id,
  text,
  sentiment,
  initialPosition,
  onDragStart,
  onDragEnd,
  isProcessing = false,
  isResolved = false
}: ThoughtProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Sentiment-based colors (overridden for resolved thoughts)
  const sentimentColors = useMemo(() => {
    // Resolved thoughts get peaceful green color
    if (isResolved) {
      return { color: 0x4ade80, emissive: 0x4ade80, emissiveIntensity: 0.8 };
    }
    
    switch (sentiment) {
      case 'negative':
        return { color: 0xff5c5c, emissive: 0xff5c5c, emissiveIntensity: 0.5 };
      case 'positive':
        return { color: 0x66cc99, emissive: 0x66cc99, emissiveIntensity: 0.5 };
      case 'neutral':
        return { color: 0xaaaaaa, emissive: 0xaaaaaa, emissiveIntensity: 0.3 };
      default:
        return { color: 0xaaaaaa, emissive: 0xaaaaaa, emissiveIntensity: 0.3 };
    }
  }, [sentiment, isResolved]);

  // Random velocity for autonomous drift (slower for resolved thoughts)
  const velocityRef = useRef<THREE.Vector3>(
    new THREE.Vector3(
      (Math.random() - 0.5) * (isResolved ? 0.01 : 0.02),
      (Math.random() - 0.5) * (isResolved ? 0.01 : 0.02),
      (Math.random() - 0.5) * (isResolved ? 0.01 : 0.02)
    )
  );

  // Random rotation speed (slower for resolved thoughts)
  const rotationSpeedRef = useRef({
    x: (Math.random() - 0.5) * (isResolved ? 0.005 : 0.01),
    y: (Math.random() - 0.5) * (isResolved ? 0.005 : 0.01),
    z: (Math.random() - 0.5) * (isResolved ? 0.005 : 0.01)
  });

  // Drag functionality using pointer events
  const [dragOffset, setDragOffset] = useState<THREE.Vector3>(new THREE.Vector3());
  const [isPointerDown, setIsPointerDown] = useState(false);

  const handlePointerDown = (event: React.PointerEvent) => {
    event.stopPropagation();
    setIsPointerDown(true);
    setIsDragging(true);
    onDragStart(id);
    
    // Calculate offset from center
    const intersectionPoint = (event as unknown as { point: THREE.Vector3 }).point;
    const currentPosition = meshRef.current?.position || new THREE.Vector3();
    setDragOffset(new THREE.Vector3().subVectors(currentPosition, intersectionPoint));
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (isPointerDown && meshRef.current) {
      const newPosition = new THREE.Vector3().addVectors((event as unknown as { point: THREE.Vector3 }).point, dragOffset);
      meshRef.current.position.copy(newPosition);
    }
  };

  const handlePointerUp = () => {
    if (isPointerDown) {
      setIsPointerDown(false);
      setIsDragging(false);
      
      if (meshRef.current) {
        const newPosition: [number, number, number] = [
          meshRef.current.position.x,
          meshRef.current.position.y,
          meshRef.current.position.z
        ];
        onDragEnd(id, newPosition);
      }
    }
  };

  // Animation frame
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Autonomous drift (only when not dragging)
    if (!isDragging) {
      const position = meshRef.current.position;
      
      // Update position based on velocity
      position.add(velocityRef.current);
      
      // Add subtle bobbing motion
      position.y += Math.sin(time + id.length) * 0.001;
      
      // Bounds checking - keep within reasonable area
      const bounds = 8;
      if (position.x > bounds) velocityRef.current.x = -Math.abs(velocityRef.current.x);
      if (position.x < -bounds) velocityRef.current.x = Math.abs(velocityRef.current.x);
      if (position.y > bounds) velocityRef.current.y = -Math.abs(velocityRef.current.y);
      if (position.y < -bounds) velocityRef.current.y = Math.abs(velocityRef.current.y);
      if (position.z > bounds) velocityRef.current.z = -Math.abs(velocityRef.current.z);
      if (position.z < -bounds) velocityRef.current.z = Math.abs(velocityRef.current.z);
      
      // Subtle rotation
      meshRef.current.rotation.x += rotationSpeedRef.current.x;
      meshRef.current.rotation.y += rotationSpeedRef.current.y;
      meshRef.current.rotation.z += rotationSpeedRef.current.z;
    }

    // Scale animations
    const targetScale = isDragging ? 1.2 : (isHovered ? 1.05 : 1.0);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Opacity for processing state
    if (isProcessing) {
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.opacity = 0.3;
          child.material.transparent = true;
        }
      });
    } else {
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.opacity = 1.0;
          child.material.transparent = true;
        }
      });
    }
  });

  return (
    <group
      ref={meshRef}
      position={initialPosition}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Main 3D Text */}
      <Text
        fontSize={0.5}
        color={sentimentColors.color}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      >
        {text}
        <meshStandardMaterial
          color={sentimentColors.color}
          emissive={sentimentColors.emissive}
          emissiveIntensity={isDragging ? sentimentColors.emissiveIntensity * 1.5 : sentimentColors.emissiveIntensity}
          transparent
          opacity={isProcessing ? 0.3 : 1.0}
        />
      </Text>

      {/* Particle Trail when dragging */}
      {isDragging && (
        <group>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial
                color={sentimentColors.color}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Glow effect */}
      <Text
        fontSize={0.52}
        color={sentimentColors.emissive}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, -0.01]}
        rotation={[0, 0, 0]}
      >
        {text}
        <meshBasicMaterial
          color={sentimentColors.emissive}
          transparent
          opacity={0.3}
        />
      </Text>

      {/* "Dealt with it!" tag for resolved thoughts */}
      {isResolved && (
        <Text
          fontSize={0.2}
          color={0x4ade80}
          anchorX="center"
          anchorY="middle"
          position={[0, -0.8, 0]}
          rotation={[0, 0, 0]}
        >
          ✓ Dealt with it!
          <meshBasicMaterial
            color={0x4ade80}
            transparent
            opacity={0.9}
          />
        </Text>
      )}
    </group>
  );
}
