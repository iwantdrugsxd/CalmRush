'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import EtherealCluster from './EtherealCluster';
import WebGLFallback from './WebGLFallback';
import { useWebGLSupport } from '../../hooks/useWebGLSupport';

// Ethereal Dust Field - Dense field of shimmering particles
function BackgroundParticles() {
  const points = useRef<THREE.Points>(null);
  
  const { particles, colors } = useMemo(() => {
    const count = 15000; // Dramatically increased particle count
    const temp = [];
    const colorArray = [];
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const radius = Math.random() * 40 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      temp.push(x, y, z);
      
      // Varied colors for each particle (purples, pinks, cyans)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Purple tones
        colorArray.push(0.5 + Math.random() * 0.3, 0.2 + Math.random() * 0.2, 0.7 + Math.random() * 0.3);
      } else if (colorChoice < 0.66) {
        // Pink tones
        colorArray.push(0.8 + Math.random() * 0.2, 0.3 + Math.random() * 0.3, 0.6 + Math.random() * 0.4);
      } else {
        // Cyan tones
        colorArray.push(0.2 + Math.random() * 0.3, 0.6 + Math.random() * 0.4, 0.8 + Math.random() * 0.2);
      }
    }
    
    return {
      particles: new Float32Array(temp),
      colors: new Float32Array(colorArray)
    };
  }, []);

  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += 0.0003;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        color="#FFFFFF"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}

// Volumetric Lighting - Enhanced for bubble cluster illumination
function SceneLighting() {
  const lightRef1 = useRef<THREE.PointLight>(null);
  const lightRef2 = useRef<THREE.PointLight>(null);
  const lightRef3 = useRef<THREE.PointLight>(null);
  const lightRef4 = useRef<THREE.PointLight>(null);
  const internalLight1 = useRef<THREE.PointLight>(null);
  const internalLight2 = useRef<THREE.PointLight>(null);
  const internalLight3 = useRef<THREE.PointLight>(null);
  const timeRef = useRef(0);

  useFrame(() => {
    timeRef.current += 0.01;
    
    // Pulsing external lights for dynamic effect
    if (lightRef1.current) {
      lightRef1.current.intensity = 3 + Math.sin(timeRef.current * 1.5) * 0.8;
    }
    if (lightRef2.current) {
      lightRef2.current.intensity = 2.5 + Math.cos(timeRef.current * 1.2) * 0.6;
    }
    if (lightRef3.current) {
      lightRef3.current.intensity = 3.5 + Math.sin(timeRef.current * 2) * 0.7;
    }
    if (lightRef4.current) {
      lightRef4.current.intensity = 3 + Math.cos(timeRef.current * 1.8) * 0.5;
    }
    
    // Internal cluster lights for bubble illumination
    if (internalLight1.current) {
      internalLight1.current.intensity = 1.5 + Math.sin(timeRef.current * 2.2) * 0.4;
    }
    if (internalLight2.current) {
      internalLight2.current.intensity = 1.2 + Math.cos(timeRef.current * 1.7) * 0.3;
    }
    if (internalLight3.current) {
      internalLight3.current.intensity = 1.8 + Math.sin(timeRef.current * 2.8) * 0.5;
    }
  });

  return (
    <>
      {/* Rich ambient light for deep purple base */}
      <ambientLight intensity={0.6} color="#300040" />
      
      {/* External light bath - positioned around the cluster */}
      <pointLight
        ref={lightRef1}
        position={[8, 8, 8]}
        color="#FF69B4"
        intensity={3}
        distance={40}
        decay={2}
      />
      <pointLight
        ref={lightRef2}
        position={[-8, -8, -8]}
        color="#00FFFF"
        intensity={2.5}
        distance={40}
        decay={2}
      />
      <pointLight
        ref={lightRef3}
        position={[-8, 8, -4]}
        color="#8A2BE2"
        intensity={3.5}
        distance={40}
        decay={2}
      />
      <pointLight
        ref={lightRef4}
        position={[8, -8, -4]}
        color="#9400D3"
        intensity={3}
        distance={40}
        decay={2}
      />
      
      {/* Internal cluster lights - positioned CLOSER to cluster for better illumination */}
      <pointLight
        ref={internalLight1}
        position={[2, 2, 2]}
        color="#FF69B4"
        intensity={4}
        distance={20}
        decay={1.5}
      />
      <pointLight
        ref={internalLight2}
        position={[-2, 2, -1]}
        color="#00FFFF"
        intensity={3.5}
        distance={18}
        decay={1.5}
      />
      <pointLight
        ref={internalLight3}
        position={[1, -2, 2]}
        color="#8A2BE2"
        intensity={4.5}
        distance={22}
        decay={1.5}
      />
    </>
  );
}

// Camera with subtle parallax
function CameraController() {
  const { camera, mouse } = useThree();
  
  useFrame(() => {
    // Very subtle mouse parallax
    const targetX = mouse.x * 0.5;
    const targetY = mouse.y * 0.5;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Main Landing Scene Component - Complete artistic overhaul
export default function LandingScene() {
  const webglSupported = useWebGLSupport();

  // Show fallback if WebGL is not supported
  if (webglSupported === false) {
    return <WebGLFallback />;
  }

  // Show loading while checking WebGL support
  if (webglSupported === null) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Initializing 3D Scene...</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas 
      dpr={[1, 1.5]} 
      className="absolute inset-0 w-full h-full"
      gl={{ 
        antialias: false, 
        alpha: false,
        powerPreference: "default",
        toneMapping: THREE.LinearToneMapping,
        toneMappingExposure: 1.0,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false
      }}
      camera={{ 
        position: [0, 0, 12], 
        fov: 50,
        near: 0.1,
        far: 1000
      }}
      onCreated={({ gl }) => {
        try {
          gl.setClearColor('#0a0a0a', 1.0);
          gl.shadowMap.enabled = false; // Disable shadows for performance
        } catch (error) {
          console.warn('WebGL setup warning:', error);
          // Force fallback on any WebGL error
          window.location.reload();
        }
      }}
      onError={(error) => {
        console.error('Canvas error:', error);
        // Force fallback on Canvas error
        window.location.reload();
      }}
    >
      {/* Deep atmospheric fog for scale and depth */}
      <fog attach="fog" args={['#0a0a0a', 20, 100]} />
      
      {/* Volumetric lighting setup */}
      <SceneLighting />
      
      {/* 3D Elements - Order matters for transparency */}
      <BackgroundParticles />
      <EtherealCluster />
      
      {/* Camera controls */}
      <CameraController />
      
      {/* Orbit controls disabled for auto-rotation */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate={false}
      />
    </Canvas>
  );
}