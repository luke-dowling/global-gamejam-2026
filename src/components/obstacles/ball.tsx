import { useMemo } from "react";
import { useTextures } from "../../hooks/use-textures";
import Obstacle from "../obstacle";
import type { ObstacleObject } from "../../types";

export default function Ball({ position }: ObstacleObject) {
  const size: [number, number] = [2, 2];
  const textures = useTextures();
  const wellTexture = useMemo(() => {
    const texture = textures.obstacleStrawBall.clone();
    return texture;
  }, [textures]);

  return <Obstacle position={position} texture={wellTexture} size={size} />;
}
