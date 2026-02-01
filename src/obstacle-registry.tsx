import Ball from "./components/obstacles/ball";
import Box from "./components/obstacles/box";
import Corp from "./components/obstacles/corp";
import Cube from "./components/obstacles/cube";
import Fence from "./components/obstacles/fence";
import Pile from "./components/obstacles/pile";
import Puddle from "./components/obstacles/puddle";
import Rocket from "./components/obstacles/rocket";
import Roll from "./components/obstacles/roll";
import Satelite from "./components/obstacles/satelite";
import Tesla from "./components/obstacles/tesla";
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
  corp: Corp,
  rocket: Rocket,
  tesla: Tesla,
  satelite: Satelite,
  ball: Ball,
  pile: Pile,
  cube: Cube,
  roll: Roll,
};
