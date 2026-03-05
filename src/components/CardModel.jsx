import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import cardImage from '../assets/Lanyard/card-lanyard.png';

const CardModelLoader = ({ onLoad }) => {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, '/models/card.glb');
  const texture = useLoader(TextureLoader, cardImage);

  useEffect(() => {
    if (gltf && texture) {
      // Apply texture to all materials in the model
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.3,
            roughness: 0.4,
          });
        }
      });
      onLoad();
    }
  }, [gltf, texture, onLoad]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group}>
      <primitive object={gltf.scene} scale={1.2} />
    </group>
  );
};

const CardModel = ({ onLoad }) => {
  return (
    <Canvas camera={{ position: [0, 0, 2.2], fov: 50 }} className="w-full h-full">
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} />
      <CardModelLoader onLoad={onLoad} />
      <OrbitControls 
        autoRotate
        autoRotateSpeed={4}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  );
};

export default CardModel;
