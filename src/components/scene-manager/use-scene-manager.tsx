import { createContext, useContext, useState } from "react";
import type { SceneName } from ".";

interface SceneManagerContextType {
  activeSceneName: SceneName;
  switchScene: (scene: SceneName) => void;
}

const SceneManagerContext = createContext<SceneManagerContextType | undefined>(
  undefined
);

export function SceneManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSceneName, setActiveSceneName] = useState<SceneName>("start");

  return (
    <SceneManagerContext.Provider
      value={{
        activeSceneName,
        switchScene: setActiveSceneName,
      }}
    >
      {children}
    </SceneManagerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSceneManager() {
  const context = useContext(SceneManagerContext);
  if (!context) {
    throw new Error("useSceneManager must be used within SceneManagerProvider");
  }
  return context;
}
