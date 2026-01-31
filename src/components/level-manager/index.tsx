import { Html } from "@react-three/drei";
import { Suspense } from "react";
import { usePreloadTextures } from "../../utils/image-preloader";
import Level1 from "./levels/level1";
import Level2 from "./levels/level2";
import { useLevelManager } from "./use-level-manager";

const levels = {
  level1: Level1,
  level2: Level2,
};

export type LevelName = keyof typeof levels;

function LevelContent() {
  const { activeLevelName } = useLevelManager();
  const { isLoaded } = usePreloadTextures();
  const Level = levels[activeLevelName];

  console.log("Textures loaded:", isLoaded);

  // Show loading state while preloading textures
  if (!isLoaded) {
    return (
      <Html center>
        <div style={{ color: "white", fontSize: "24px" }}>Loading...</div>
      </Html>
    );
  }

  return <Level />;
}

export default function LevelManager() {
  return (
    <Suspense
      fallback={
        <Html center>
          <div style={{ color: "white", fontSize: "24px" }}>Loading...</div>
        </Html>
      }
    >
      <LevelContent />
    </Suspense>
  );
}
