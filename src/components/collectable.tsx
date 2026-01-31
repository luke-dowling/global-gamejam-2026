import { useCollectable } from "../hooks/use-collectable";

export interface CollectableProps {
  position: [number, number];
  color: string;
  onCollect: () => void;
}

export default function Collectable({
  position,
  color,
  onCollect,
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
    <mesh ref={meshRef} position={[position[0], position[1], 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}
