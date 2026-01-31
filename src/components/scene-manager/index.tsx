import Game from "../../Scene/game"
import Menu from "../../Scene/menu"
import Start from "../../Scene/start"
import { useSceneManager } from "./use-scene-manager"

const scenes = {
  start: Start,
  menu: Menu,
  game: Game,
}

export type SceneName = keyof typeof scenes

export default function SceneManager() {
  const { activeSceneName } = useSceneManager()

  const Scene = scenes[activeSceneName]

  return <Scene />
}
