import TestScene from "../test-scene";
import TestSceneTwo from "../test-scene-two";
import { useSceneManager } from "./use-scene-manager";

const scenes = {
  test: TestScene,
  test2: TestSceneTwo,
};

export type SceneName = keyof typeof scenes;

export default function SceneManager() {
  const { activeSceneName } = useSceneManager();

  const Scene = scenes[activeSceneName];

  return <Scene />;
}
