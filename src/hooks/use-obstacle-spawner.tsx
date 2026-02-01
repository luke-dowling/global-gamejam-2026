import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { ObstacleConfig, ObstacleType } from "../types";
import { useGame } from "./use-game";

interface ObstacleSpawnerConfig {
  obstacleTypes: ObstacleType[];
  initialObstacles?: ObstacleConfig[];
  chunkSize?: number;
  obstaclesPerChunk?: number;
}

// Seeded random number generator for consistent chunk generation
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function useObstacleSpawner({
  initialObstacles = [],
  obstacleTypes,
  chunkSize = 32,
  obstaclesPerChunk = 5,
}: ObstacleSpawnerConfig) {
  const [obstacles, setObstacles] =
    useState<ObstacleConfig[]>(initialObstacles);
  const { playerPosition } = useGame();
  const generatedChunksRef = useRef<Set<string>>(new Set());
  const lastChunkRef = useRef({ cx: 0, cy: 0 });

  // Generate obstacles for chunks around player
  useFrame(() => {
    const cx = Math.floor(playerPosition.x / chunkSize);
    const cy = Math.floor(playerPosition.y / chunkSize);

    // Only check if player moved to a different chunk
    if (cx === lastChunkRef.current.cx && cy === lastChunkRef.current.cy) {
      return;
    }
    lastChunkRef.current = { cx, cy };

    // Batch all new obstacles to update state only once
    const allNewObstacles: ObstacleConfig[] = [];

    // Check 3x3 grid of chunks around player
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const chunkX = cx + dx;
        const chunkY = cy + dy;
        const chunkKey = `${chunkX},${chunkY}`;

        if (!generatedChunksRef.current.has(chunkKey)) {
          generatedChunksRef.current.add(chunkKey);

          // Generate obstacles for this chunk
          const seed = chunkX * 73856093 + chunkY * 19349663;

          for (let i = 0; i < obstaclesPerChunk; i++) {
            const posXRand = seededRandom(seed + i + 1000);
            const posYRand = seededRandom(seed + i + 2000);

            // Use real random for obstacle type to get more variety
            const type =
              obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

            // Position within the chunk
            const position: [number, number] = [
              chunkX * chunkSize + posXRand * chunkSize,
              chunkY * chunkSize + posYRand * chunkSize,
            ];

            allNewObstacles.push({
              id: `obs-${chunkKey}-${i}`,
              type,
              position,
              size: [2, 2],
            });
          }
        }
      }
    }

    // Single state update with all new obstacles
    if (allNewObstacles.length > 0) {
      setObstacles((prev) => [...prev, ...allNewObstacles]);
    }
  });

  return { obstacles };
}
