import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { followPlayer } from "../../../utils/movement";
import SpeedUp from "../../collectables/speed-up";
import Enemy from "../../enemy";
import Obstacle from "../../obstacle";
import HealingPotion from "../../collectables/healing-potion";

export default function Level1() {
  const floorTexture = useTexture("/src/assets/floor.png");

  useMemo(() => {
    if (floorTexture) {
      // Configure texture for pixel art and tiling
      floorTexture.magFilter = THREE.NearestFilter;
      floorTexture.minFilter = THREE.NearestFilter;
      floorTexture.wrapS = THREE.RepeatWrapping;
      floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(32, 32);
    }
  }, [floorTexture]);

  return (
    <>
      {/* Floor plane */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[32, 32]} />
        <meshBasicMaterial map={floorTexture} />
      </mesh>

      <Obstacle position={[3, 0]} size={[2, 2]} color="#ff6b6b" />
      <Obstacle position={[-4, 2]} size={[1.5, 1.5]} color="#51cf66" />
      <Obstacle position={[0, -3]} size={[3, 1]} color="#339af0" />
      <Obstacle position={[-2, -5]} size={[1, 2]} color="#ffd43b" />
      <Obstacle position={[5, -2]} size={[2, 2]} color="#f783ac" />

      <SpeedUp position={[0, 5]} duration={3} speedMultiplier={2} />
      <SpeedUp position={[-5, -5]} duration={5} speedMultiplier={3} />
      <SpeedUp position={[5, 5]} duration={4} speedMultiplier={2.5} />

      <HealingPotion position={[0, 8]} />
      <HealingPotion position={[8, 0]} />
      <HealingPotion position={[4, 4]} />

      <Enemy position={[6, -6]} speed={1.5} movementBehavior={followPlayer} />
      <Enemy position={[6, 6]} speed={1} movementBehavior={followPlayer} />
      <Enemy position={[-6, -6]} speed={2} movementBehavior={followPlayer} />
      <Enemy position={[-6, 6]} speed={1.2} movementBehavior={followPlayer} />
    </>
  );
}
