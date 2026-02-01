export interface ObstacleObject {
  position: [number, number];
  size?: readonly [number, number];
}
export type ObstacleType = "fence" | "well" | "puddle" | "box" | "rocket" | "satelite" | "corp" | "tesla" ;
export type ObstacleConfig = {
  id: string;
  type: ObstacleType;
  position: [number, number, number];
  size?: [number, number];
};