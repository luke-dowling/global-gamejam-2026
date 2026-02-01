import { useMemo } from "react";
import { useTextures } from "../../hooks/use-textures";
import Obstacle from "../obstacle";
import type { ObstacleObject } from "../../types";

export default function Fence({ position }: ObstacleObject) {
  const size: [number, number] = [2, 2];
  const textures = useTextures();
  const fenceTexture = useMemo(() => {
    const texture = textures.obstacleFence.clone();
    return texture;
  }, [textures]);

  return <Obstacle position={position} texture={fenceTexture} size={size} />;
}
