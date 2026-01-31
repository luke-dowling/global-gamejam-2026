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

export type SceneName = keyof typeof scenes;

export default function SceneManager() {
  const { activeSceneName } = useSceneManager();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(mainTheme);
      audioRef.current.volume = 0.6;
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;

    const startAudio = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        audio.play().catch((error) => {
          console.error("Failed to play background music:", error);
        });
      }
    };

    // Wait for user interaction before playing
    const handleInteraction = () => {
      startAudio();
      // Remove listeners after first interaction
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const Scene = scenes[activeSceneName];

  return <Scene />;
}
