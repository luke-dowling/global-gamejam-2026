import { useMemo } from "react";
import { useTextures } from "../../hooks/use-textures";
import Obstacle from "../obstacle";
import type { ObstacleObject } from "../../types";

export default function Box({ position, size }: ObstacleObject) {
  const test = size ?? [2, 2];
  const textures = useTextures();
  const boxTexture = useMemo(() => {
    const texture = textures.obstacleBox.clone();
    return texture;
  }, [textures]);

  return <Obstacle position={position} texture={boxTexture} size={test} />;
}
