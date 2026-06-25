import { Canvas } from "@react-three/fiber";
import { Environment, Center, CameraControls } from "@react-three/drei";

export default function App() {
  return (
    <Canvas shadows camera={{ position: [-1, 0, 2.5], fov: 25 }}>
      <ambientLight intensity={0.5} />
      <Environment preset="city" />

      <Center>
        <Shirt />
      </Center>

      <CameraControls />
    </Canvas>
  );
}

function Shirt() {
  return (
    <mesh>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial />
    </mesh>
  );
}
