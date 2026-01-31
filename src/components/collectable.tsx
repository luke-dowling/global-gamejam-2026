import type { Texture } from "three";
import { useCollectable } from "../hooks/use-collectable";

export interface CollectableProps {
  position: [number, number];
  color: string;
  onCollect: () => void;
  texture: Texture;
}

export default function Collectable({
  position,
  onCollect,
  texture,
}: CollectableProps) {
  const { meshRef, isCollected } = useCollectable({
    onCollect: () => {
      console.log("Collectable collected!");
      onCollect?.();
    },
  });

  if (isCollected) {
    return null;
  }

  return (
    <mesh ref={meshRef} name="mesh" position={[position[0], position[1], 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}
