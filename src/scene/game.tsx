import { Html } from "@react-three/drei";
import { Suspense } from "react";
import LevelManager from "../components/level-manager";
import { LevelManagerProvider } from "../components/level-manager/use-level-manager";
import Player from "../player";
import { TexturesProvider, usePreloadTextures } from "../hooks/use-textures";
import { AudioProvider, usePreloadAudio } from "../hooks/use-audio";
import World from "../world";

function GameContent() {
  const { isLoaded: texturesLoaded, textures } = usePreloadTextures();
  const { isLoaded: audioLoaded, audio } = usePreloadAudio();

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
        <World />
        <LevelManagerProvider>
          <LevelManager />
          <Player />
        </LevelManagerProvider>
      </AudioProvider>
    </TexturesProvider>
  );
}

export default function Game() {
  return (
    <Suspense
      fallback={
        <Html center>
          <div style={{ color: "white", fontSize: "24px" }}>Loading...</div>
        </Html>
      }
    >
      <GameContent />
    </Suspense>
  );
}
