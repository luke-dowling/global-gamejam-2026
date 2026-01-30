import { useState } from "react";
import type { SceneName } from ".";

export function useSceneManager() {
  const [activeSceneName, setActiveSceneName] = useState<SceneName>("test");

  return {
    activeSceneName,
    switchScene: setActiveSceneName,
  };
}
