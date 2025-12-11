// ! COMMENT OUT - THIS COMPONENT IS NOT IN USE CURRENTLY
// "use client";

// import React, { useRef } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// // Gem geometry component with enhanced visuals
// const GemGeometry = () => {
//   const meshRef = useRef<THREE.Mesh>(null);
//   const groupRef = useRef<THREE.Group>(null);

//   // Rotate the gem continuously with a more interesting animation
//   useFrame((state, delta) => {
//     if (groupRef.current) {
//       groupRef.current.rotation.y += delta * 0.3;
//       // Add subtle bobbing motion
//       groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
//     }
//   });

//   return (
//     <group ref={groupRef} position={[0, 0, 0]}>
//       <mesh ref={meshRef} castShadow receiveShadow>
//         <octahedronGeometry args={[1, 0]} />
//         <meshPhysicalMaterial
//           color={new THREE.Color(0.95, 0.85, 0.3)} // Brighter gold
//           metalness={0.9}
//           roughness={0.1}
//           clearcoat={1}
//           clearcoatRoughness={0.05}
//           transmission={0.95}
//           transparent={true}
//           opacity={0.95}
//           emissive={new THREE.Color(0.9, 0.7, 0.2)}
//           emissiveIntensity={0.4}
//           ior={1.5}
//           specularIntensity={1}
//           envMapIntensity={1}
//         />
//       </mesh>
      
//       {/* Inner core for more depth */}
//       <mesh scale={0.6}>
//         <octahedronGeometry args={[1, 0]} />
//         <meshBasicMaterial 
//           color={new THREE.Color(1, 0.95, 0.4)} 
//           transparent 
//           opacity={0.4} 
//         />
//       </mesh>
//     </group>
//   );
// };

// // Environment lighting component
// const Environment = () => {
//   return (
//     <>
//       {/* Ambient light */}
//       <ambientLight intensity={0.4} />
      
//       {/* Key light */}
//       <directionalLight
//         position={[5, 5, 5]}
//         intensity={1.2}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />
      
//       {/* Fill light */}
//       <pointLight position={[-5, -5, -5]} intensity={0.5} color="white" />
      
//       {/* Rim light for glow effect */}
//       <pointLight position={[0, 0, 5]} intensity={0.8} color="gold" />
      
//       {/* Additional accent lights */}
//       <pointLight position={[3, -3, 2]} intensity={0.4} color="#FFD700" />
//       <pointLight position={[-3, 3, 2]} intensity={0.4} color="#FFA500" />
//     </>
//   );
// };

// // Main 3D Gem component
// const Gem3D = () => {
//   console.log("Gem3D component rendering");
  
//   return (
//     <div className="relative w-full h-full min-h-[200px] min-w-[200px]">
//       <Canvas
//         camera={{ position: [0, 0, 3], fov: 50 }}
//         className="cursor-pointer"
//         frameloop="always"
//         dpr={[1, 2]}
//         gl={{ antialias: true, alpha: true }}
//         style={{ width: '100%', height: '100%', display: 'block' }}
//       >
//         {/* Environment lighting */}
//         <Environment />
        
//         {/* The gem */}
//         <GemGeometry />
        
//         {/* Background color for better visibility */}
//         <color attach="background" args={['#00000000']} />
//       </Canvas>
//     </div>
//   );
// };

// export default Gem3D;