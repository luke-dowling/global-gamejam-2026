import Game from "../../scene/game";
import LevelSelect from "../../scene/level-select";
import Start from "../../scene/start";
import GameOver from "../../scene/game-over";
import { useSceneManager } from "./use-scene-manager";
import Highscore from "../../scene/highscore";

const scenes = {
  start: Start,
  "level-select": LevelSelect,
  game: Game,
  gameOver: GameOver,
  highscore: Highscore,
};

export type SceneName = keyof typeof scenes;

export default function SceneManager() {
  const { activeSceneName } = useSceneManager();

  const Scene = scenes[activeSceneName];

  return <Scene />;
}
