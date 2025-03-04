import { OrbitControls } from "@react-three/drei";
import Fox from "../component3d/Fox";

const Experience = () => {
  return (
    <>
      <OrbitControls />
      <ambientLight />
      <directionalLight
        position={[-5, 5, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <group position={[-15, -2.5, 0]}>
        <Fox />
      </group>

      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -2.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10, 1, 1]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};

export default Experience;
