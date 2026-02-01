import { createContext, useContext, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useSceneManager } from "../components/scene-manager/use-scene-manager";

interface PlayerPosition {
  x: number;
  y: number;
  z: number;
}

interface GameContextType {
  playerPosition: PlayerPosition;
  movePlayer: (position: PlayerPosition) => void;
  obstacleRefs: React.MutableRefObject<THREE.Object3D[]>;
  speedMultiplier: number;
  setSpeedMultiplier: (multiplier: number) => void;
  playerHealth: number;
  takePlayerDamage: () => void;
  healPlayer: () => void;
  resetPlayer: () => void;
  gameEventLog: string[];
  updateGameEventLog: (log: string) => void;
  isPlayerImmuneToDamage: boolean;
  setIsPlayerImmuneToDamage: (bool: boolean) => void;
  addPlayerPoints: () => void;
  playerPoints: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
const initialPlayerSetUp = {
  position: { x: 0, y: 0, z: 0 },
  speedMultiplier: 1,
  playerHealth: 5,
  gameEventLog: [],
  playerPoints: 0,
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const { switchScene } = useSceneManager();

  // gamer logger
  const [gameEventLog, setGameEventLog] = useState<string[]>(
    initialPlayerSetUp.gameEventLog
  );
  const updateGameEventLog = (log: string) => {
    setGameEventLog((prev) => {
      const newLog = [...prev, log];
      // Keep only the last 3 logs
      return newLog.length > 3 ? newLog.slice(-3) : newLog;
    });
  };

  // player config
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const obstacleRefs = useRef<THREE.Object3D[]>([]);

  const [playerHealth, setPlayerHealth] = useState<number>(5);
  const [isPlayerImmuneToDamage, setIsPlayerImmuneToDamage] = useState(false);
  const [playerPoints, setPlayerPoints] = useState(0);
  console.log("playerPoints", playerPoints);

  const addPlayerPoints = () => {
    setPlayerPoints((prev) => Math.max(0, prev + 100));
  };

  const takePlayerDamage = () => {
    if (isPlayerImmuneToDamage) {
      return;
    } else {
      updateGameEventLog("Damage: 1 point");
      setPlayerHealth(Math.max(0, playerHealth - 1));
      setPlayerPoints((prev) => prev - 100);
    }
  };

  useEffect(() => {
    if (playerHealth <= 0) {
      switchScene("gameOver");
    }
  }, [playerHealth, switchScene]);

  const healPlayer = () => {
    updateGameEventLog("Heal: 1 point");
    if (playerHealth < 5) {
      setPlayerHealth(Math.max(0, playerHealth + 1));
    }
  };

  const resetPlayer = () => {
    setPlayerPosition(initialPlayerSetUp.position);
    setSpeedMultiplier(initialPlayerSetUp.speedMultiplier);
    setPlayerHealth(initialPlayerSetUp.playerHealth);
    setGameEventLog([]);
    setPlayerPoints(0);
  };

  return (
    <GameContext.Provider
      value={{
        playerPosition,
        movePlayer: setPlayerPosition,
        obstacleRefs,
        speedMultiplier,
        setSpeedMultiplier,
        playerHealth,
        takePlayerDamage,
        healPlayer,
        resetPlayer,
        gameEventLog,
        updateGameEventLog,
        isPlayerImmuneToDamage,
        setIsPlayerImmuneToDamage,
        addPlayerPoints,
        playerPoints,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
