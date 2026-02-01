import Box from "./components/obstacles/box";
import Fence from "./components/obstacles/fence";
import Puddle from "./components/obstacles/puddle";
import Well from "./components/obstacles/well";
import type { ObstacleType } from "./types";

export const OBSTACLE_REGISTRY: Record<
  ObstacleType,
  React.ComponentType<{
    position: [number, number];
    size?: readonly [number, number];
  }>
> = {
  fence: Fence,
  well: Well,
  puddle: Puddle,
  box: Box,
};
