"use client";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

function LookAtZeroCam() {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return <></>;
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const object = useLoader(GLTFLoader, "/scene.glb");
  const { actions, names } = useAnimations(object.animations, group);

  useEffect(() => {
    console.log(object);
    console.log("Знайдені анімації:", actions);

    Array.from(Object.entries(actions)).forEach(([name, action]) => {
      if (!action) {
        console.log("No action!", name);
        return;
      }
      action!.setLoop(THREE.LoopRepeat, Infinity);
      action!.clampWhenFinished = false;
      action!.reset().fadeIn(0.5).play();
    });

    object.scene.traverse((child) => {
      const mesh = child as THREE.Mesh;

      if (mesh.isMesh && mesh.material) {
        const material = mesh.material as THREE.MeshStandardMaterial;

        material.emissiveMap = null;
        material.emissive.setHex(0x000000);
        material.emissiveIntensity = 0;

        material.needsUpdate = true;
      }

      const light = child as THREE.Light;

      if (light.isLight) {
        light.intensity = light.intensity / 20;
      }
    });
  }, [object, actions]);

  return (
    <group ref={group}>
      <primitive object={object.scene} />
    </group>
  );
}

export function HomeScene() {
  return (
    <Canvas
      camera={{ position: [3, 4, 7], fov: 75 }}
      // gl={{
      //   outputColorSpace: THREE.SRGBColorSpace,
      //   toneMapping: THREE.ACESFilmicToneMapping,
      //   toneMappingExposure: 1.6,
      // }}
    >
      <Scene />
      <OrbitControls autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
}
