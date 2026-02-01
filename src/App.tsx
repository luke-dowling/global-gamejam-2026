import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import SceneManager from "./components/scene-manager";
import { SceneManagerProvider } from "./components/scene-manager/use-scene-manager";
import { GameProvider } from "./hooks/use-game";
import { LevelManagerProvider } from "./components/level-manager/use-level-manager";

export default function App() {
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    // Enable audio playback after user interaction
    // This is required by browsers to prevent unwanted autoplay
    const handleInteraction = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        // Remove listeners after first interaction
        document.removeEventListener("keydown", handleInteraction);
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("touchstart", handleInteraction);
      }
    };

    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <div id="canvas-container">
      <Canvas>
        <SceneManagerProvider>
          <GameProvider>
            <LevelManagerProvider>
              <SceneManager />
            </LevelManagerProvider>
          </GameProvider>
        </SceneManagerProvider>
      </Canvas>
    </div>
  );
}
