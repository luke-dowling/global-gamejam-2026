import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGame } from "../hooks/use-game";
import type { Texture } from "three";

interface ObstacleProps {
  position: [number, number];
  size?: readonly [number, number];
  texture?: Texture;
}

export default function Obstacle({ position, size, texture }: ObstacleProps) {
  const { obstacleRefs } = useGame();
  const obstacleRef = useRef<THREE.Mesh>(null!);

  // Register obstacle with game context
  useEffect(() => {
    if (obstacleRef.current) {
      obstacleRefs.current.push(obstacleRef.current);
    }
    return () => {
      if (obstacleRef.current) {
        const index = obstacleRefs.current.indexOf(obstacleRef.current);
        if (index > -1) {
          obstacleRefs.current.splice(index, 1);
        }
      }
    };
  }, [obstacleRefs]);

  return (
    <mesh ref={obstacleRef} position={[position[0], position[1], 0]}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}
