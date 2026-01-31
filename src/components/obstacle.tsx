import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGame } from "../hooks/use-game";

interface ObstacleProps {
  position: [number, number];
  size?: [number, number];
  color?: string;
}

export default function Obstacle({
  position,
  size = [2, 2],
  color = "#ff6b6b",
}: ObstacleProps) {
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
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
