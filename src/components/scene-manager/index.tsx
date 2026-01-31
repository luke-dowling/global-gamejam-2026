import Game from "../../scene/game";
import Menu from "../../scene/menu";
import Start from "../../scene/start";
import GameOver from "../../scene/game-over";
import { useSceneManager } from "./use-scene-manager";

const scenes = {
  start: Start,
  menu: Menu,
  game: Game,
  gameOver: GameOver
};

export type SceneName = keyof typeof scenes;

export default function SceneManager() {
  const { activeSceneName } = useSceneManager();

  const Scene = scenes[activeSceneName];

  return <Scene />;
}
