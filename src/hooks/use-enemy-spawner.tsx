import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { type ComponentType } from "react";

export type EnemyType = {
  component: ComponentType<{
    position: [number, number];
    onDestroy?: () => void;
  }>;
  weight?: number; // Probability weight for spawning (default: 1)
};

export type SpawnedEnemy = {
  id: number;
  position: [number, number];
  type: EnemyType;
};

interface EnemySpawnerConfig {
  spawnInterval: number;
  enemyTypes: EnemyType[]; // Array of enemy types to spawn
  initialEnemies?: SpawnedEnemy[];
  screenBorder?: number;
}

export function useEnemySpawner({
  initialEnemies = [],
  spawnInterval,
  enemyTypes,
  screenBorder = 12,
}: EnemySpawnerConfig) {
  const [enemies, setEnemies] = useState<SpawnedEnemy[]>(initialEnemies);
  const nextIdRef = useRef(
    initialEnemies.length > 0
      ? Math.max(...initialEnemies.map((e) => e.id)) + 1
      : 1
  );
  const spawnTimerRef = useRef(0);

  const removeEnemy = (id: number) => {
    setEnemies((prev) => prev.filter((enemy) => enemy.id !== id));
  };

  // Select a random enemy type based on weights
  const selectRandomEnemyType = (): EnemyType => {
    const totalWeight = enemyTypes.reduce(
      (sum, type) => sum + (type.weight ?? 1),
      0
    );
    let random = Math.random() * totalWeight;

    for (const type of enemyTypes) {
      random -= type.weight ?? 1;
      if (random <= 0) {
        return type;
      }
    }

    return enemyTypes[0]; // Fallback
  };

  // Spawn new enemies over time with increasing difficulty
  useFrame((_, delta) => {
    spawnTimerRef.current += delta;

    if (spawnTimerRef.current >= spawnInterval) {
      spawnTimerRef.current = 0;

      const newId = nextIdRef.current++;
      // Random spawn position at the border of the visible screen
      const edge = Math.floor(Math.random() * 4);
      let position: [number, number];

      switch (edge) {
        case 0: // top
          position = [
            Math.random() * screenBorder * 2 - screenBorder,
            screenBorder,
          ];
          break;
        case 1: // right
          position = [
            screenBorder,
            Math.random() * screenBorder * 2 - screenBorder,
          ];
          break;
        case 2: // bottom
          position = [
            Math.random() * screenBorder * 2 - screenBorder,
            -screenBorder,
          ];
          break;
        default: // left
          position = [
            -screenBorder,
            Math.random() * screenBorder * 2 - screenBorder,
          ];
      }

      const enemyType = selectRandomEnemyType();

      setEnemies((prev) => [...prev, { id: newId, position, type: enemyType }]);
    }
  });

  return { enemies, removeEnemy };
}
