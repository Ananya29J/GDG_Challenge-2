"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Sparkles, Float, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

export function StadiumEnvironment({ teamColor = "#00f3ff" }: { teamColor?: string }) {
  const lightRef = useRef<THREE.PointLight>(null!)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    lightRef.current.position.x = Math.sin(time) * 10
    lightRef.current.position.z = Math.cos(time) * 10
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
      <color attach="background" args={['#020617']} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={20} size={2} speed={0.5} color={teamColor} />

      <ambientLight intensity={0.2} />
      <pointLight ref={lightRef} intensity={100} color={teamColor} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={150} color={teamColor} />
      
      {/* Abstract Stadium Floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#0f172a" 
          roughness={0.1} 
          metalness={0.8}
        />
      </mesh>

      {/* Floating Energy Core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, 2, 0]}>
          <icosahedronGeometry args={[1, 15]} />
          <meshStandardMaterial 
            color={teamColor} 
            emissive={teamColor}
            emissiveIntensity={2}
            wireframe
          />
        </mesh>
      </Float>
    </>
  )
}
