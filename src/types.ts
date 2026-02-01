export interface ObstacleObject {
  position: [number, number];
  size?: readonly [number, number];
}
export type ObstacleType = "fence" | "well" | "puddle" | "box";
export type ObstacleConfig = {
  id: string;
  type: ObstacleType;
  position: [number, number, number];
  size?: [number, number];
};