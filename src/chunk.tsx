import { useMemo } from "react";
import { useTextures } from "./hooks/use-textures";

interface Position {
  x: number;
  y: number;
  z: number;
}
interface ChunkProps {
  position: Position;
}
export default function Chunk({ position }: ChunkProps) {
  const { floorGrey } = useTextures();
  const floorTexture = useMemo(() => {
    const texture = floorGrey.clone();
    texture.repeat.set(32, 32);
    return texture;
  }, [floorGrey]);
  return (
    <mesh position={[position.x, position.y, position.z]}>
      <planeGeometry args={[32, 32]} />
      <meshBasicMaterial map={floorTexture} />
    </mesh>
  );
}
