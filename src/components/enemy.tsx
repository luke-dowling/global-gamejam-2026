import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  useAnimation,
  type Animation,
  type SpriteSheetData,
} from "../hooks/use-animation";
import { useGame } from "../hooks/use-game";
import { isColliding } from "../utils/collision";
import { type MovementBehavior } from "../utils/movement";

interface EnemyProps {
  position: [number, number];
  spriteSheet: SpriteSheetData;
  idleAnimation: Animation;
  movingAnimation?: Animation;
  dyingAnimation?: Animation;
  speed: number;
  movementBehavior: MovementBehavior;
  onDestroy?: () => void;
  onDying?: () => void;
  health?: number;
  isWalker?: boolean;
}

export default function Enemy({
  position,
  spriteSheet,
  idleAnimation,
  movingAnimation,
  dyingAnimation,
  speed,
  movementBehavior,
  onDestroy,
  onDying,
  isWalker = false,
}: EnemyProps) {
  const { playerPosition, takePlayerDamage } = useGame();
  const enemyMeshRef = useRef<THREE.Mesh>(null!);
  const playerMeshRef = useRef<THREE.Mesh | null>(null);
  const hasCollidedRef = useRef<boolean>(false);
  const previousPositionRef = useRef<THREE.Vector3 | null>(null);
  const [facingDirection, setFacingDirection] = useState<"left" | "right">(
    "left"
  );
  const [isDying, setIsDying] = useState(false);
  const dyingAnimationStartedRef = useRef(false);
  const dyingAnimationTimeRef = useRef(0);

  const { playAnimation, updateFrame } = useAnimation(
    spriteSheet,
    idleAnimation
  );

  const enemyTexture = useMemo(() => {
    if (!spriteSheet.texture) return null;
    const texture = spriteSheet.texture.clone();
    // Set initial UV repeat based on sprite sheet
    texture.repeat.set(1 / spriteSheet.cols, 1 / spriteSheet.rows);
    return texture;
  }, [spriteSheet]);

  // Calculate total duration of dying animation
  const dyingAnimationDuration = useMemo(() => {
    if (!dyingAnimation) return 0;
    return dyingAnimation.reduce((total, frame) => total + frame.duration, 0);
  }, [dyingAnimation]);

  const { addPlayerPoints } = useGame();

  useFrame(({ scene }, delta) => {
    if (!enemyMeshRef.current) return;

    // Handle dying state
    if (isDying) {
      if (dyingAnimation) {
        // Play dying animation once
        if (!dyingAnimationStartedRef.current) {
          playAnimation(dyingAnimation);
          dyingAnimationStartedRef.current = true;
          onDying?.();
          addPlayerPoints();
        }

        updateFrame(delta, enemyTexture);
        dyingAnimationTimeRef.current += delta;

        // Check if dying animation is complete
        if (dyingAnimationTimeRef.current >= dyingAnimationDuration) {
          onDestroy?.();
        }
      } else {
        // No dying animation, destroy immediately
        onDestroy?.();
      }
      return; // Don't process movement or collisions while dying
    }

    const currentPos = enemyMeshRef.current.position.clone();

    movementBehavior({
      currentPosition: enemyMeshRef.current.position,
      playerPosition,
      delta,
      speed,
    });

    // Track horizontal movement direction for mirroring
    const deltaX = previousPositionRef.current
      ? enemyMeshRef.current.position.x - previousPositionRef.current.x
      : 0;

    if (deltaX > 0) {
      setFacingDirection("left");
    } else if (deltaX < 0) {
      setFacingDirection("right");
    }

    // Mirror the mesh based on facing direction
    enemyMeshRef.current.scale.x = facingDirection === "left" ? -1 : 1;

    // Determine if enemy is moving
    const isMoving =
      previousPositionRef.current &&
      !enemyMeshRef.current.position.equals(previousPositionRef.current);

    // Update animation based on movement
    if (isMoving && movingAnimation) {
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

      // Only damage player if not a walker
      if (!isWalker) {
        takePlayerDamage();
      }

      if (!isDying) {
        setIsDying(true);
      }
    }
  });

  return (
    <mesh ref={enemyMeshRef} position={[position[0], position[1], 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={enemyTexture} transparent />
    </mesh>
  );
}
