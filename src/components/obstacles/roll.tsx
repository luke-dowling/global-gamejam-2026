import { useMemo } from "react";
import { useTextures } from "../../hooks/use-textures";
import Obstacle from "../obstacle";
import type { ObstacleObject } from "../../types";

export default function Roll({ position }: ObstacleObject) {
  const size: [number, number] = [2, 2];
  const textures = useTextures();
  const wellTexture = useMemo(() => {
    const texture = textures.obstacleStrawRoll.clone();
    return texture;
  }, [textures]);

  return <Obstacle position={position} texture={wellTexture} size={size} />;
}
