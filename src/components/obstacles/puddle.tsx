import { useMemo } from "react";
import { useTextures } from "../../hooks/use-textures";
import Obstacle from "../obstacle";
import type { ObstacleObject } from "../../types";

export default function Puddle({ position }: ObstacleObject) {
  const size: [number, number] = [2, 2];
  const textures = useTextures();
  const puddleTexture = useMemo(() => {
    const texture = textures.obstaclePuddle.clone();
    return texture;
  }, [textures]);

  return <Obstacle position={position} texture={puddleTexture} size={size} />;
}
