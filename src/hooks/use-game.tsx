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
  applySpeedBoost: (multiplier: number, duration: number) => void;
  playerHealth: number;
  takePlayerDamage: () => void;
  healPlayer: () => void;
  resetPlayer: () => void;
  gameEventLog: string[];
  updateGameEventLog: (log: string) => void;
  isPlayerImmuneToDamage: boolean;
  setIsPlayerImmuneToDamage: (bool: boolean) => void;
  applyImmunityBoost: (duration: number) => void;
  addPlayerPoints: () => void;
  playerPoints: number;
  gameTime: number;
  incrementGameTime: (delta: number) => void;
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
  const speedBoostTimeoutRef = useRef<number | null>(null);
  const immunityTimeoutRef = useRef<number | null>(null);

  const [playerHealth, setPlayerHealth] = useState<number>(5);
  const [isPlayerImmuneToDamage, setIsPlayerImmuneToDamage] = useState(false);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [gameTime, setGameTime] = useState(0);

  const incrementGameTime = (delta: number) => {
    setGameTime((prev) => prev + delta);
  };

  const addPlayerPoints = () => {
    setPlayerPoints((prev) => Math.max(0, prev + 100));
  };

  const applySpeedBoost = (multiplier: number = 2, duration: number = 10) => {
    // Clear any existing timeout
    if (speedBoostTimeoutRef.current) {
      clearTimeout(speedBoostTimeoutRef.current);
    }

    // Apply the speed boost
    setSpeedMultiplier(multiplier);

    // Reset to normal speed after duration
    speedBoostTimeoutRef.current = setTimeout(() => {
      setSpeedMultiplier(1);
      speedBoostTimeoutRef.current = null;
    }, duration * 1000) as unknown as number;
  };

  const applyImmunityBoost = (duration: number = 3) => {
    // Clear any existing timeout
    if (immunityTimeoutRef.current) {
      clearTimeout(immunityTimeoutRef.current);
    }

    // Apply immunity
    setIsPlayerImmuneToDamage(true);

    // Remove immunity after duration
    immunityTimeoutRef.current = setTimeout(() => {
      setIsPlayerImmuneToDamage(false);
      immunityTimeoutRef.current = null;
    }, duration * 1000) as unknown as number;
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
    setGameTime(0);
  };

  return (
    <GameContext.Provider
      value={{
        playerPosition,
        movePlayer: setPlayerPosition,
        obstacleRefs,
        speedMultiplier,
        setSpeedMultiplier,
        applySpeedBoost,
        playerHealth,
        takePlayerDamage,
        healPlayer,
        resetPlayer,
        gameEventLog,
        updateGameEventLog,
        isPlayerImmuneToDamage,
        setIsPlayerImmuneToDamage,
        applyImmunityBoost,
        addPlayerPoints,
        playerPoints,
        gameTime,
        incrementGameTime,
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
