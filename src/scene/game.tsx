import { Html } from "@react-three/drei";
import { useEffect } from "react";
import Camera from "../camera";
import LevelManager from "../components/level-manager";
import { AudioProvider, usePreloadAudio, useSound } from "../hooks/use-audio";
import { useGame } from "../hooks/use-game";
import { TexturesProvider, usePreloadTextures } from "../hooks/use-textures";
import Player from "../player";
import World from "../world";

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
  const mainThemeSound = useSound("mainTheme");

  useEffect(() => {
    mainThemeSound.setVolume(0.6);
    mainThemeSound.setLoop(true);
    mainThemeSound.play().catch((error) => {
      console.error("Failed to play background music:", error);
    });

    return () => {
      mainThemeSound.stop();
    };
  }, [mainThemeSound]);

  return (
    <>
      <World />
      <LevelManager />
      <Player />
      <Camera />
    </>
  );
}
