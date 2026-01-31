import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import floorImage from "../../../assets/floor.png";
import { useEnemySpawner } from "../../../hooks/use-enemy-spawner";
import SpeedUp from "../../collectables/speed-up";
import Caugher from "../../enemies/caugher";
import Walker from "../../enemies/walker";
import Obstacle from "../../obstacle";

export default function Level2() {
  const floorTexture = useTexture(floorImage);
  const { enemies, removeEnemy } = useEnemySpawner({
    spawnInterval: 1.5,
    enemyTypes: [{ component: Caugher }, { component: Walker }],
    initialEnemies: [
      {
        id: 1,
        position: [5, 5],
        type: { component: Caugher },
      },
    ],
  });

  useMemo(() => {
    if (floorTexture) {
      // Configure texture for pixel art and tiling
      // eslint-disable-next-line react-hooks/immutability
      floorTexture.magFilter = THREE.NearestFilter;
      // eslint-disable-next-line react-hooks/immutability
      floorTexture.minFilter = THREE.NearestFilter;
      // eslint-disable-next-line react-hooks/immutability
      floorTexture.wrapS = THREE.RepeatWrapping;
      // eslint-disable-next-line react-hooks/immutability
      floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(40, 40);
    }
  }, [floorTexture]);

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
