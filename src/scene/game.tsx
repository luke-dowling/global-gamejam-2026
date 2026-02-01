import { Html } from "@react-three/drei";
import { useEffect } from "react";
import Camera from "../camera";
import LevelManager from "../components/level-manager";
import { AudioProvider, usePreloadAudio, useSound } from "../hooks/use-audio";
import { useGame } from "../hooks/use-game";
import { TexturesProvider, usePreloadTextures } from "../hooks/use-textures";
import Player from "../player";
import World from "../world";
import { useLevelManager } from "../components/level-manager/use-level-manager";
import type { LevelName } from "../components/level-manager";

export default function Game() {
  const { resetPlayer } = useGame();
  const { isLoaded: texturesLoaded, textures } = usePreloadTextures();
  const { isLoaded: audioLoaded, audio } = usePreloadAudio();

  // Reset player health and state when entering the game scene
  useEffect(() => {
    resetPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoaded = texturesLoaded && audioLoaded;

  console.log("Textures loaded:", texturesLoaded);
  console.log("Audio loaded:", audioLoaded);

  // Show loading state while preloading textures and audio
  if (!isLoaded) {
    return (
      <Html center>
        <div style={{ color: "white", fontSize: "24px" }}>Loading...</div>
      </Html>
    );
  }

  return (
    <TexturesProvider value={textures}>
      <AudioProvider value={audio}>
        <GameContent />
      </AudioProvider>
    </TexturesProvider>
  );
}

function GameContent() {
  const { activeLevelName } = useLevelManager();

  // Map level names to their corresponding theme audio keys
  const levelThemeMap: Record<
    LevelName,
    "covidTheme" | "elonTheme" | "strohTheme"
  > = {
    covid: "covidTheme",
    elon: "elonTheme",
    stroh: "strohTheme",
  };

  const themeKey = levelThemeMap[activeLevelName];
  const levelTheme = useSound(themeKey);

  useEffect(() => {
    levelTheme.setVolume(0.5);
    levelTheme.setLoop(true);
    levelTheme.play().catch((error) => {
      console.error("Failed to play background music:", error);
    });

    return () => {
      levelTheme.stop();
    };
  }, [levelTheme, activeLevelName]);

  return (
    <>
      <World />
      <LevelManager />
      <Player />
      <Camera />
    </>
  );
}
