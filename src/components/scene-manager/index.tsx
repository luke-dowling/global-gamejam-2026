import Game from "../../scene/game";
import Start from "../../scene/start";
import { useSceneManager } from "./use-scene-manager";

const scenes = {
  start: Start,
  game: Game,
};

export type SceneName = keyof typeof scenes;

export default function SceneManager() {
  const { activeSceneName } = useSceneManager();

  const Scene = scenes[activeSceneName];

  return <Scene />;
}
