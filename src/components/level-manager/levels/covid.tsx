import { useMemo } from "react";
import { useEnemySpawner } from "../../../hooks/use-enemy-spawner";
import { useRespawningCollectables } from "../../../hooks/use-respawning-collectables";
import { useTextures } from "../../../hooks/use-textures";
import HealingPotion from "../../collectables/healing-potion";
import SpeedUp from "../../collectables/speed-up";
import VaccinationImmunity from "../../collectables/vaccination-immunity";
import Cougher from "../../enemies/cougher";
import Walker from "../../enemies/walker";
import { boundsAroundPlayer } from "../../../collectable-utils";
import { useGame } from "../../../hooks/use-game";
import { OBSTACLE_REGISTRY } from "../../../obstacle-registry";
import type { ObstacleConfig, ObstacleType } from "../../../types";

const obstacleConfigs1 = [
  { position: [3, 0] as [number, number], size: [2, 2] as [number, number] },
  {
    position: [-4, 2] as [number, number],
    size: [1.5, 1.5] as [number, number],
  },
  { position: [0, -3] as [number, number], size: [3, 1] as [number, number] },
  {
    position: [-2, -5] as [number, number],
    size: [1, 2] as [number, number],
  },
  { position: [5, -2] as [number, number], size: [2, 2] as [number, number] },
];
const TYPES: ObstacleType[] = ["fence", "well", "puddle", "box"];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomPointInRing(minDist: number, maxDist: number): [number, number] {
  const angle = Math.random() * Math.PI * 2;

  // Uniform area distribution in an annulus:
  const r2 =
    minDist * minDist + Math.random() * (maxDist * maxDist - minDist * minDist);
  const r = Math.sqrt(r2);

  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

export default function LevelCovid() {
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

  const {
    healthPotions,
    speedUps,
    vaccinationImmunities,
    onHealthPotionCollect,
    onSpeedUpCollect,
    onVaccinationImmunityCollect,
  } = useRespawningCollectables({
    obstacles: obstacleConfigs1,
    bounds: bounds,
    collectableConfig: {
      healthPotions: 1,
      speedUps: 3,
      vaccinationImmunities: 3,
    },
    respawnDelay: 5000,
  });

  const textures = useTextures();
  const floorTexture = useMemo(() => {
    const texture = textures.floor.clone();
    texture.repeat.set(32, 32);
    return texture;
  }, [textures]);

  const MIN_DIST = 4;
  const MAX_DIST = 20;
  const [dx, dy] = randomPointInRing(MAX_DIST, MIN_DIST);
  const position: [number, number, number] = [
    playerPosition.x + dx,
    playerPosition.y + dy,
    0,
  ];

  const { enemies, removeEnemy } = useEnemySpawner({
    initialSpawnInterval: 1,
    enemyTypes: [{ component: Cougher }, { component: Walker }],
    initialEnemies: [
      {
        id: 1,
        position: [6, 6],
        type: { component: Cougher },
      },
    ],
  });

  const count = 20;
  const obstacleConfigs = useMemo<ObstacleConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const type = TYPES[randInt(0, TYPES.length - 1)];
      return {
        id: `obs-${i}-${crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)}`,
        type,
        position,
        size: [2, 2],
      };
    });
  }, [count]);

  return (
    <>
      {/* Floor plane */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[32, 32]} />
        <meshBasicMaterial map={floorTexture} />
      </mesh>
      {obstacleConfigs.map((config) => {
        const Comp = OBSTACLE_REGISTRY[config.type];
        return (
          <Comp
            key={config.id}
            position={[config.position[0], config.position[1]]}
            size={config.size}
          />
        );
      })}
      {/* {obstacleConfigs.map((config, index) => (
        <Obstacle
          key={index}
          position={config.position}
          size={config.size}
          color={["#ff6b6b", "#51cf66", "#339af0", "#ffd43b", "#f783ac"][index]}
        />
      ))} */}

      {speedUps.map((speedUp) => (
        <SpeedUp
          key={speedUp.id}
          id={speedUp.id}
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
