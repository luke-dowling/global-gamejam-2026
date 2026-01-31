import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import enemyImage from "../assets/enemy.png";
import {
  useAnimation,
  type Animation,
  type SpriteSheetData,
} from "../hooks/use-animation";
import { useGame } from "../hooks/use-game";
import { isColliding } from "../utils/collision";
import { type MovementBehavior } from "../utils/movement";

const spriteSheet: SpriteSheetData = {
  url: enemyImage,
  tileWidth: 32,
  tileHeight: 32,
  rows: 1,
  cols: 1,
};

const idleAnimation: Animation = [{ x: 0, y: 0, duration: 1 }];

const movingAnimation: Animation = [{ x: 0, y: 0, duration: 1 }];

interface EnemyProps {
  position: [number, number];
  speed: number;
  movementBehavior: MovementBehavior;
  onDestroy?: () => void;
}

export default function Enemy({
  position,
  speed,
  movementBehavior,
  onDestroy,
}: EnemyProps) {
  const { playerPosition, takePlayerDamage } = useGame();
  const enemyMeshRef = useRef<THREE.Mesh>(null!);
  const playerMeshRef = useRef<THREE.Mesh | null>(null);
  const hasCollidedRef = useRef<boolean>(false);
  const previousPositionRef = useRef<THREE.Vector3 | null>(null);
  const { playAnimation, updateFrame } = useAnimation(
    spriteSheet,
    idleAnimation
  );

  const enemyTexture = useTexture(spriteSheet.url, (texture) => {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // Set initial UV repeat based on sprite sheet
    texture.repeat.set(1 / spriteSheet.cols, 1 / spriteSheet.rows);
  });

  useFrame(({ scene }, delta) => {
    if (!enemyMeshRef.current) return;

    const currentPos = enemyMeshRef.current.position.clone();

    movementBehavior({
      currentPosition: enemyMeshRef.current.position,
      playerPosition,
      delta,
      speed,
    });

    // Determine if enemy is moving
    const isMoving =
      previousPositionRef.current &&
      !enemyMeshRef.current.position.equals(previousPositionRef.current);

    // Update animation based on movement
    if (isMoving) {
      playAnimation(movingAnimation);
    } else {
      playAnimation(idleAnimation);
    }

    updateFrame(delta, enemyTexture);
    previousPositionRef.current = currentPos;

    // Find player mesh once
    if (!playerMeshRef.current) {
      const playerMesh = scene.getObjectByName("player-mesh");
      if (playerMesh instanceof THREE.Mesh) {
        playerMeshRef.current = playerMesh;
      } else {
        return; // Exit early if player not found
      }
    }

    // Check collision with player
    if (
      isColliding(enemyMeshRef.current, playerMeshRef.current) &&
      !hasCollidedRef.current
    ) {
      hasCollidedRef.current = true;
      takePlayerDamage();
      onDestroy?.();
    }
  });

  return (
    <mesh ref={enemyMeshRef} position={[position[0], position[1], 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={enemyTexture} transparent color="#ff4444" />
    </mesh>
  );
}
