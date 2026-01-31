import { Html } from "@react-three/drei";
import { Suspense } from "react";
import LevelManager from "../components/level-manager";
import { LevelManagerProvider } from "../components/level-manager/use-level-manager";
import Player from "../player";
import { TexturesProvider, usePreloadTextures } from "../hooks/use-textures";
import World from "../world";

function GameContent() {
  const { isLoaded, textures } = usePreloadTextures();

  console.log("Textures loaded:", isLoaded);

  // Show loading state while preloading textures
  if (!isLoaded) {
    return (
      <Html center>
        <div style={{ color: "white", fontSize: "24px" }}>Loading...</div>
      </Html>
    );
  }

  return (
    <TexturesProvider value={textures}>
      <World />
      <LevelManagerProvider>
        <LevelManager />
        <Player />
      </LevelManagerProvider>
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
