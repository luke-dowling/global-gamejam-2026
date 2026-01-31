import { useEffect, useRef } from "react";
import Game from "../../scene/game";
import Menu from "../../scene/menu";
import Start from "../../scene/start";
import GameOver from "../../scene/game-over";
import { useSceneManager } from "./use-scene-manager";
import mainTheme from "../../assets/audio/main-theme.mp3";

const scenes = {
  start: Start,
  menu: Menu,
  game: Game,
  gameOver: GameOver,
};

const audio = new Audio(mainTheme);

export type SceneName = keyof typeof scenes;

export default function SceneManager() {
  const { activeSceneName } = useSceneManager();

  const audioRef = useRef<HTMLAudioElement>(audio);

  useEffect(() => {
    const audio = audioRef.current;

    audio.play().catch((error) => {
      console.error("Failed to play background music:", error);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const Scene = scenes[activeSceneName];

  return <Scene />;
}
