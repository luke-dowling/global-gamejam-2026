import Level1 from "./levels/level1";
import Level2 from "./levels/level2";
import { useLevelManager } from "./use-level-manager";

const levels = {
  level1: Level1,
  level2: Level2,
};

export type LevelName = keyof typeof levels;

export default function LevelManager() {
  const { activeLevelName } = useLevelManager();
  const Level = levels[activeLevelName];

  return <Level />;
}
