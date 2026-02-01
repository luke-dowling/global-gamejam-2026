import LevelCovid from "./levels/covid";
import LevelElon from "./levels/elon";
import LevelStroh from "./levels/stroh";
import { useLevelManager } from "./use-level-manager";

const levels = {
  covid: LevelCovid,
  elon: LevelElon,
  stroh: LevelStroh,
};

export type LevelName = keyof typeof levels;

export default function LevelManager() {
  const { activeLevelName } = useLevelManager();
  const Level = levels[activeLevelName];

  return <Level />;
}
