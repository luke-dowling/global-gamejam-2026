import type { Texture } from "three";
import { useCollectable } from "../hooks/use-collectable";
import type { GameAudio } from "../hooks/use-audio";

export interface CollectableProps {
  position: [number, number];
  onCollect: () => void;
  texture: Texture;
  pickupSound: keyof GameAudio;
}

export default function Collectable({
  position,
  onCollect,
  texture,
  pickupSound,
}: CollectableProps) {
  const { meshRef, isCollected } = useCollectable({
    pickupSound,
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
