import { useMemo } from "react";
import { useEnemySpawner } from "../../../hooks/use-enemy-spawner";
import { useRespawningCollectables } from "../../../hooks/use-respawning-collectables";
import { useTextures } from "../../../hooks/use-textures";
import HealingPotion from "../../collectables/healing-potion";
import SpeedUp from "../../collectables/speed-up";
import VaccinationImmunity from "../../collectables/vaccination-immunity";
import Hater from "../../enemies/hater";
import TechBro from "../../enemies/tech-bro";
import { boundsAroundPlayer } from "../../../collectable-utils";
import { useGame } from "../../../hooks/use-game";
import { OBSTACLE_REGISTRY } from "../../../obstacle-registry";
import type { ObstacleType } from "../../../types";
import { useObstacleSpawner } from "../../../hooks/use-obstacle-spawner";

const OBSTACLE_TYPES: ObstacleType[] = ["fence", "well", "puddle", "box"];

export default function LevelElon() {
  const { playerPosition } = useGame();

  const CHUNK_SIZE = 32;

  const cx = Math.floor(playerPosition.x / CHUNK_SIZE);
  const cy = Math.floor(playerPosition.y / CHUNK_SIZE);

  const bounds = useMemo(() => {
    // center of the current chunk
    const centerX = (cx + 0.5) * CHUNK_SIZE;
    const centerY = (cy + 0.5) * CHUNK_SIZE;
    return boundsAroundPlayer(centerX, centerY, 10);
  }, [cx, cy]);

  const { obstacles } = useObstacleSpawner({
    obstacleTypes: OBSTACLE_TYPES,
    chunkSize: 32,
    obstaclesPerChunk: 5,
  });

  const {
    healthPotions,
    speedUps,
    vaccinationImmunities,
    onHealthPotionCollect,
    onSpeedUpCollect,
    onVaccinationImmunityCollect,
  } = useRespawningCollectables({
    obstacles: obstacles,
    bounds: bounds,
    collectableConfig: {
      healthPotions: 1,
      speedUps: 2,
      vaccinationImmunities: 2,
    },
    respawnDelay: 8000,
  });

  const textures = useTextures();
  const floorTexture = useMemo(() => {
    const texture = textures.floor.clone();
    texture.repeat.set(32, 32);
    return texture;
  }, [textures]);

  const { enemies, removeEnemy } = useEnemySpawner({
    initialSpawnInterval: 0.7,
    enemyTypes: [{ component: TechBro }, { component: Hater, weight: 3 }],
    initialEnemies: [
      {
        id: 1,
        position: [5, 5],
        type: { component: Hater },
      },
      {
        id: 2,
        position: [-5, -5],
        type: { component: TechBro },
      },
    ],
  });

  return (
    <>
      {/* Floor plane */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[32, 32]} />
        <meshBasicMaterial map={floorTexture} />
      </mesh>

      {obstacles.map((config) => {
        const Comp = OBSTACLE_REGISTRY[config.type];
        return (
          <Comp
            key={config.id}
            position={[config.position[0], config.position[1]]}
            size={config.size}
          />
        );
      })}

      {speedUps.map((speedUp) => (
        <SpeedUp
          key={speedUp.id}
          position={[speedUp.position[0], speedUp.position[1]]}
          duration={3}
          speedMultiplier={2}
          onCollect={onSpeedUpCollect}
        />
      ))}

      {healthPotions.map((potion) => (
        <HealingPotion
          key={potion.id}
          id={potion.id}
          position={[potion.position[0], potion.position[1]]}
          onCollect={onHealthPotionCollect}
        />
      ))}

      {vaccinationImmunities.map((immunity) => (
        <VaccinationImmunity
          key={immunity.id}
          id={immunity.id}
          position={[immunity.position[0], immunity.position[1]]}
          onCollect={onVaccinationImmunityCollect}
        />
      ))}

      {enemies.map((enemy) => {
        const EnemyComponent = enemy.type.component;
        return (
          <EnemyComponent
            key={enemy.id}
            position={enemy.position}
            onDestroy={() => removeEnemy(enemy.id)}
          />
        );
      })}
    </>
  );
}
