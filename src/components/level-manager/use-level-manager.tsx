import { createContext, useContext, useState } from "react";
import type { LevelName } from ".";

interface LevelManagerContextType {
  activeLevelName: LevelName;
  switchLevel: (level: LevelName) => void;
}

const LevelManagerContext = createContext<LevelManagerContextType | undefined>(
  undefined
);

export function LevelManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeLevelName, setActiveLevelName] = useState<LevelName>("level1");

  return (
    <LevelManagerContext.Provider
      value={{
        activeLevelName,
        switchLevel: setActiveLevelName,
      }}
    >
      {children}
    </LevelManagerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLevelManager() {
  const context = useContext(LevelManagerContext);
  if (!context) {
    throw new Error("useLevelManager must be used within LevelManagerProvider");
  }
  return context;
}
