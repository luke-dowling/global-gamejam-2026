import { useMemo } from "react";
import { useEnemySpawner } from "../../../hooks/use-enemy-spawner";
import { useTextures } from "../../../hooks/use-textures";
import SpeedUp from "../../collectables/speed-up";
import Hater from "../../enemies/hater";
import TechBro from "../../enemies/tech-bro";
import Obstacle from "../../obstacle";

export default function LevelElon() {
  const textures = useTextures();
  const floorTexture = useMemo(() => {
    const texture = textures.floor.clone();
    texture.repeat.set(40, 40);
    return texture;
  }, [textures]);

  const { enemies, removeEnemy } = useEnemySpawner({
    initialSpawnInterval: 1.5,
    enemyTypes: [{ component: TechBro }, { component: Hater }],
    initialEnemies: [
      {
        id: 1,
        position: [5, 5],
        type: { component: TechBro },
      },
    ],
  });

  return (
    <>
      {/* Floor plane */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial map={floorTexture} />
      </mesh>

      <Obstacle position={[-8, 8]} size={[2, 2]} color="#51cf66" />
      <Obstacle position={[8, 8]} size={[2, 2]} color="#339af0" />
      <Obstacle position={[-8, -8]} size={[2, 2]} color="#ffd43b" />
      <Obstacle position={[8, -8]} size={[2, 2]} color="#f783ac" />

      <SpeedUp position={[10, 10]} duration={5} speedMultiplier={2.5} />
      <SpeedUp position={[-10, -10]} duration={4} speedMultiplier={3} />
      <SpeedUp position={[0, -12]} duration={6} speedMultiplier={2} />

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
