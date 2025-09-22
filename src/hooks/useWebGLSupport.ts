'use client';

import { useState, useEffect } from 'react';

export function useWebGLSupport() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
        
        if (!gl) {
          setIsSupported(false);
          return;
        }

        // Check for SwiftShader (software rendering)
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer && renderer.includes('SwiftShader')) {
            console.warn('SwiftShader detected - using fallback rendering');
            setIsSupported(false);
            return;
          }
        }

        // Test basic WebGL functionality
        const testProgram = gl.createProgram();
        if (testProgram) {
          gl.deleteProgram(testProgram);
          setIsSupported(true);
        } else {
          setIsSupported(false);
        }
      } catch (error) {
        console.warn('WebGL check failed:', error);
        setIsSupported(false);
      }
    };

    checkWebGLSupport();
  }, []);

  return isSupported;
}

