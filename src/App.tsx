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
import { Suspense, useRef, useEffect, type ReactNode } from "react";
import { Group } from "three";
import { easing } from "maath";
import {
  useSelectedDecal,
  useShirtActions,
  getShirtState,
} from "./stores/stores"; // ← Updated import
import type { ThreeElements } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { shirtConfig } from "./config/shirtConfig";
import { KTX2Loader } from "three-stdlib";

export default function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        dpr={[1, 2]}
        className="r3f"
        shadows
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 2.5], fov: 25 }}
      >
        <Suspense fallback={null}>
          <CanvasExporter />
          <ambientLight intensity={0.75} />
          <Environment preset="city" />
          <CameraRig>
            <Backdrop />
            <Center>
              <Shirt />
            </Center>
          </CameraRig>
        </Suspense>
      </Canvas>
    </div>
  );
}
// ====================== SHIRT ======================

const ktx2Loader = new KTX2Loader().setTranscoderPath("/basis/");

function Shirt(props: ThreeElements["group"]) {
  const { gl } = useThree();

  const selectedDecal = useSelectedDecal();

  const texture = useTexture(`/${selectedDecal.id}.png`);

  const { nodes, materials } = useGLTF(
    "/shirt_optimized_final.glb",
    true,
    false,
    (loader) => {
      ktx2Loader.detectSupport(gl); //
      loader.setKTX2Loader(ktx2Loader); //
    },
  ) as unknown as GLTFResult as unknown as GLTFResult;

  useFrame((_, delta) => {
    const { selectedColorId } = getShirtState();
    easing.dampC(
      materials["lambert1.001"].color,
      shirtConfig.colors[selectedColorId].hex,
      0.25,
      delta,
    );
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials["lambert1.001"]}
        position={[0.419, 0, 0]}
      >
        <Decal
          position={[0.0, 0.37, 0.07]}
          rotation={[
            (0 * Math.PI) / 180,
            (7 * Math.PI) / 180,
            (-1 * Math.PI) / 180,
          ]}
          scale={[0.15, 0.15, 0.54]}
        >
          <meshBasicMaterial
            map={texture}
            transparent
            polygonOffset
            polygonOffsetFactor={-10}
            polygonOffsetUnits={-4}
            depthWrite={false}
            alphaTest={0.01}
            opacity={0.7}
            map-anisotropy={16}
          />
        </Decal>
      </mesh>
    </group>
  );
}

// ====================== BACKDROP ======================
function Backdrop() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shadows = useRef<any>(null);

  useFrame((_, delta) => {
    if (!shadows.current) return;

    const { selectedColorId } = getShirtState();

    easing.dampC(
      shadows.current.getMesh().material.color,
      shirtConfig.colors[selectedColorId].hex,
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
      position={[0, 0, -0.15]}
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

// ====================== CAMERA RIG ======================
const CAMERA_TARGET: [number, number, number] = [0, 0, 2];
const ROTATION_TARGET: [number, number, number] = [0, 0, 0];

function CameraRig({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null!);

  useFrame((state, delta) => {
    const { intro } = getShirtState(); // frame-only → transient
    CAMERA_TARGET[0] = intro ? -0.25 : 0;
    easing.damp3(state.camera.position, CAMERA_TARGET, 0.25, delta);

    ROTATION_TARGET[0] = state.pointer.y / 10;
    ROTATION_TARGET[1] = -state.pointer.x / 5;
    easing.dampE(group.current.rotation, ROTATION_TARGET, 0.25, delta);
  });

  return <group ref={group}>{children}</group>;
}

// ====================== DOWNLOAD ======================
function CanvasExporter() {
  const { registerDownload } = useShirtActions();
  const { gl } = useThree();
  useEffect(() => {
    const fn = () => {
      gl.domElement.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "custom-shirt.png";
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    registerDownload(fn);
    return () => registerDownload(null);
  }, [gl, registerDownload]);
  return null;
}

type GLTFResult = GLTF & {
  nodes: { T_Shirt_male: THREE.Mesh };
  materials: { "lambert1.001": THREE.MeshStandardMaterial };
};

Object.values(shirtConfig.decals).forEach((d) =>
  useTexture.preload(`/${d.id}.png`),
);

getShirtState().hydrateFromURL();
