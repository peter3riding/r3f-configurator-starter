import * as THREE from "three";
import { type GLTF } from "three-stdlib";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Center,
  useGLTF,
  AccumulativeShadows,
  RandomizedLight,
  useTexture,
  Decal,
} from "@react-three/drei";
import { useRef, type ReactNode } from "react";
import { Group } from "three";
import { easing } from "maath";
import useStore from "./stores/stores";
import type { ThreeElements } from "@react-three/fiber";

export default function App() {
  return (
    <Canvas className="r3f" shadows camera={{ position: [0, 0, 2.5], fov: 25 }}>
      <ambientLight intensity={0.75} />
      <Environment preset="city" />

      <CameraRig>
        <Backdrop />

        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  );
}

type GLTFResult = GLTF & {
  nodes: {
    T_Shirt_male: THREE.Mesh;
  };
  materials: {
    lambert1: THREE.MeshStandardMaterial;
  };
};

function Shirt(props: ThreeElements["group"]) {
  const selectedDecal = useStore((state) => state.selectedDecal);

  const texture = useTexture(`/${selectedDecal}.png`);

  const { nodes, materials } = useGLTF(
    "/shirt_baked4.glb",
  ) as unknown as GLTFResult;

  useFrame((_, delta) => {
    const currentColor = useStore.getState().selectedColor;
    easing.dampC(materials.lambert1.color, currentColor, 0.25, delta);
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        position={[0.419, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        {" "}
        <Decal
          position={[0, 0.04, 0.15]}
          rotation={[0, 0, 0]}
          scale={0.15}
          map={texture}
          map-anisotropy={16}
          // Modern props:
          depthTest={true}
          depthWrite={false} // Usually better for decals
          transparent
        />
      </mesh>
    </group>
  );
}

function Backdrop() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shadows = useRef<any>(null);

  useFrame((_, delta) => {
    const currentColor = useStore.getState().selectedColor;
    if (!shadows.current) return;

    easing.dampC(
      shadows.current.getMesh().material.color,
      currentColor,
      0.25,
      delta,
    );
  });

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={100}
      alphaTest={0.2}
      scale={2}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight
        amount={5}
        radius={9}
        intensity={0.5}
        ambient={0.35}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={6}
        intensity={0.3}
        ambient={0.45}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
}

type CameraRigProps = {
  children: ReactNode;
};

function CameraRig({ children }: CameraRigProps) {
  const group = useRef<Group>(null!);

  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [0, 0, 2], 0.25, delta);

    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta,
    );
  });

  return <group ref={group}>{children}</group>;
}

useGLTF.preload("/shirt_baked4.glb");
