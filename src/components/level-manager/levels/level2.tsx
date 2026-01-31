import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { fleeFromPlayer } from "../../../utils/movement";
import SpeedUp from "../../collectables/speed-up";
import Enemy from "../../enemy";
import Obstacle from "../../obstacle";

export default function Level2() {
  const floorTexture = useTexture("/src/assets/floor.png", (texture) => {
    // Configure texture for pixel art and tiling
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(40, 40);
  });

  return (
    <>
      {/* Floor plane */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial map={floorTexture} />
      </mesh>

      <Obstacle position={[0, 0]} size={[4, 4]} color="#ff6b6b" />
      <Obstacle position={[-8, 8]} size={[2, 2]} color="#51cf66" />
      <Obstacle position={[8, 8]} size={[2, 2]} color="#339af0" />
      <Obstacle position={[-8, -8]} size={[2, 2]} color="#ffd43b" />
      <Obstacle position={[8, -8]} size={[2, 2]} color="#f783ac" />

      <SpeedUp position={[10, 10]} duration={5} speedMultiplier={2.5} />
      <SpeedUp position={[-10, -10]} duration={4} speedMultiplier={3} />
      <SpeedUp position={[0, -12]} duration={6} speedMultiplier={2} />

      <Enemy position={[10, -10]} speed={2} movementBehavior={fleeFromPlayer} />
      <Enemy position={[-10, 10]} speed={2} movementBehavior={fleeFromPlayer} />
      <Enemy
        position={[-10, -10]}
        speed={1.8}
        movementBehavior={fleeFromPlayer}
      />
      <Enemy
        position={[10, 10]}
        speed={1.8}
        movementBehavior={fleeFromPlayer}
      />
      <Enemy position={[0, 15]} speed={2.5} movementBehavior={fleeFromPlayer} />
    </>
  );
}
