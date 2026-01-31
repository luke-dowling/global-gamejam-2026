import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGame } from "../hooks/use-game";

interface EnemyProps {
  position: [number, number];
  speed?: number;
}

export default function Enemy({ position, speed = 1 }: EnemyProps) {
  const { playerPosition } = useGame();
  const enemyMeshRef = useRef<THREE.Mesh>(null!);
  const enemyTexture = useTexture("/src/assets/enemy.png", (texture) => {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
  });

  useFrame((_, delta) => {
    if (!enemyMeshRef.current) return;
    const currentPos = enemyMeshRef.current.position;

    // Calculate direction to player
    const dx = playerPosition.x - currentPos.x;
    const dy = playerPosition.y - currentPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize and move towards player
    if (distance > 0.1) {
      const normalizedX = dx / distance;
      const normalizedY = dy / distance;

      currentPos.x += normalizedX * speed * delta;
      currentPos.y += normalizedY * speed * delta;
    }
  });

  return (
    <mesh ref={enemyMeshRef} position={[position[0], position[1], 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={enemyTexture} transparent color="#ff4444" />
    </mesh>
  );
}
