import { useState, useCallback, useEffect, useRef } from "react";

interface ObstacleConfig {
  position: [number, number];
  size?: [number, number];
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface CollectableConfig {
  healthPotions: number;
  speedUps: number;
  vaccinationImmunities: number;
}

interface RespawningCollectablesConfig {
  obstacles: ObstacleConfig[];
  bounds: Bounds;
  collectableConfig: CollectableConfig;
  respawnDelay?: number;
}

interface CollectableItem {
  id: string;
  position: [number, number, number];
}

const isInsideBounds = (pos: [number, number, number], b: Bounds) => {
  const [x, y] = pos;
  return x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY;
};

export function useRespawningCollectables({
  obstacles,
  bounds,
  collectableConfig,
  respawnDelay = 3000,
}: RespawningCollectablesConfig) {
  const boundsRef = useRef(bounds);
  useEffect(() => {
    boundsRef.current = bounds;
  }, [bounds]);

  const generateId = () => `collectable-${Math.random().toString(16).slice(2)}`;

  const generateRandomPosition = useCallback((): [number, number, number] => {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const b = boundsRef.current;

      const x = Math.random() * (b.maxX - b.minX) + b.minX;
      const y = Math.random() * (b.maxY - b.minY) + b.minY;

      // Check if position collides with any obstacle
      let hasCollision = false;
      for (const obstacle of obstacles) {
        const [obsX, obsY] = obstacle.position;
        const [sizeX, sizeY] = obstacle.size || [2, 2]; // Default size if not specified

        const halfSizeX = sizeX / 2;
        const halfSizeY = sizeY / 2;
        const collectableRadius = 0.5;

        if (
          x + collectableRadius > obsX - halfSizeX &&
          x - collectableRadius < obsX + halfSizeX &&
          y + collectableRadius > obsY - halfSizeY &&
          y - collectableRadius < obsY + halfSizeY
        ) {
          hasCollision = true;
          break;
        }
      }

      if (!hasCollision) {
        return [x, y, 0];
      }

      attempts++;
    }

    console.warn("Could not find valid spawn position, using fallback");
    return [0, 0, 0];
  }, [obstacles]);

  const generateInitialCollectables = useCallback(
    (count: number): CollectableItem[] => {
      return Array.from({ length: count }, () => ({
        id: generateId(),
        position: generateRandomPosition(),
      }));
    },
    [generateRandomPosition]
  );

  // Use lazy initialization
  const [healthPotions, setHealthPotions] = useState<CollectableItem[]>(() =>
    generateInitialCollectables(collectableConfig.healthPotions)
  );

  const [speedUps, setSpeedUps] = useState<CollectableItem[]>(() =>
    generateInitialCollectables(collectableConfig.speedUps)
  );

  const [vaccinationImmunities, setVaccinationImmunities] = useState<
    CollectableItem[]
  >(() => generateInitialCollectables(collectableConfig.vaccinationImmunities));

  const boundsKey = `${bounds.minX},${bounds.maxX},${bounds.minY},${bounds.maxY}`;

  useEffect(() => {
    const reconcile = (
      prev: CollectableItem[],
      target: number
    ): CollectableItem[] => {
      const b = boundsRef.current;

      // despawn if not visible (outside bounds)
      const inside = prev.filter((it) => isInsideBounds(it.position, b));
      const MAX_SPAWN_PER_TICK = 5;

      // fill back up to target count in current bounds
      const missing = Math.max(0, target - inside.length);
      const spawnNow = Math.min(missing, MAX_SPAWN_PER_TICK);
      if (spawnNow === 0) return inside;

      const spawned = generateInitialCollectables(spawnNow);
      return [...inside, ...spawned];
    };

    setHealthPotions((prev) =>
      reconcile(prev, collectableConfig.healthPotions)
    );
    setSpeedUps((prev) => reconcile(prev, collectableConfig.speedUps));
    setVaccinationImmunities((prev) =>
      reconcile(prev, collectableConfig.vaccinationImmunities)
    );
  }, [
    boundsKey,
    collectableConfig.healthPotions,
    collectableConfig.speedUps,
    collectableConfig.vaccinationImmunities,
    generateInitialCollectables,
  ]);

  const handleHealthPotionCollect = useCallback(
    (id: string) => {
      setHealthPotions((prev) => prev.filter((item) => item.id !== id));

      setTimeout(() => {
        setHealthPotions((prev) => [
          ...prev,
          { id: generateId(), position: generateRandomPosition() },
        ]);
      }, respawnDelay);
    },
    [generateRandomPosition, respawnDelay]
  );

  const handleSpeedUpCollect = useCallback(
    (id: string) => {
      setSpeedUps((prev) => prev.filter((item) => item.id !== id));

      setTimeout(() => {
        setSpeedUps((prev) => [
          ...prev,
          { id: generateId(), position: generateRandomPosition() },
        ]);
      }, respawnDelay);
    },
    [generateRandomPosition, respawnDelay]
  );
  const handleSpeedUpRemove = useCallback((id: string) => {
    setSpeedUps((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleVaccinationImmunityCollect = useCallback(
    (id: string) => {
      setVaccinationImmunities((prev) => prev.filter((item) => item.id !== id));

      setTimeout(() => {
        setVaccinationImmunities((prev) => [
          ...prev,
          { id: generateId(), position: generateRandomPosition() },
        ]);
      }, respawnDelay);
    },
    [generateRandomPosition, respawnDelay]
  );

  return {
    healthPotions,
    speedUps,
    vaccinationImmunities,
    onHealthPotionCollect: handleHealthPotionCollect,
    onSpeedUpCollect: handleSpeedUpCollect,
    onSpeedUpRemove: handleSpeedUpRemove,
    onVaccinationImmunityCollect: handleVaccinationImmunityCollect,
  };
}
