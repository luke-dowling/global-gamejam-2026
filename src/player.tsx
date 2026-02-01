import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import * as THREE from "three";
import { useLevelManager } from "./components/level-manager/use-level-manager";
import {
  useAnimation,
  type Animation,
  type SpriteSheetData,
} from "./hooks/use-animation";
import { useControls } from "./hooks/use-controls";
import { useGame } from "./hooks/use-game";
import { useTextures } from "./hooks/use-textures";
import { isColliding } from "./utils/collision";

const spriteSheet: SpriteSheetData = {
  url: "", // URL not needed anymore
  tileWidth: 32,
  tileHeight: 32,
  rows: 1,
  cols: 5,
};

const idleAnimation: Animation = [{ x: 0, y: 0, duration: 0.1 }];
const runningAnimation: Animation = [
  { x: 1, y: 0, duration: 0.1 },
  { x: 2, y: 0, duration: 0.15 },
  { x: 3, y: 0, duration: 0.1 },
  { x: 2, y: 0, duration: 0.15 },
];
const beingHitAnimation: Animation = [{ x: 4, y: 0, duration: 0.2 }];

export default function Player() {
  const {
    playerPosition,
    movePlayer,
    obstacleRefs,
    speedMultiplier,
    playerHealth,
    isPlayerImmuneToDamage,
  } = useGame();
  const isTouch = useMediaQuery({ query: "(pointer: coarse)" });
  const { activeLevelName } = useLevelManager();
  const { size } = useThree();
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const velocityRef = useRef(velocity);
  const playerMeshRef = useRef<THREE.Mesh>(null!);
  const [isBeingHit, setIsBeingHit] = useState(false);
  const previousHealthRef = useRef(playerHealth);
  const [facingDirection, setFacingDirection] = useState<"left" | "right">(
    "left"
  );
  const [showImmunityBubble, setShowImmunityBubble] = useState(false);
  const immunityBubbleRef = useRef<THREE.Mesh>(null);
  const isTouchActiveRef = useRef(false);
  const { playAnimation, updateFrame } = useAnimation(
    spriteSheet,
    idleAnimation
  );

  const textures = useTextures();
  const characterTexture = useMemo(() => {
    let textureBase = textures.playerSprites;
    switch (activeLevelName) {
      case "elon":
        textureBase = textures.playerElon;
        break;
      case "stroh":
        textureBase = textures.playerStroh;
        break;
      case "covid":
      default:
        textureBase = textures.playerSprites;
    }
    const texture = textureBase.clone();
    // Set initial UV repeat based on sprite sheet
    texture.repeat.set(1 / spriteSheet.cols, 1 / spriteSheet.rows);
    return texture;
  }, [textures, activeLevelName]);
  const handleTouchMove = (e: TouchEvent) => {
    if (!isTouchActiveRef.current) return;

    const touch = e.touches[0];
    if (!touch) return;

    // Calculate direction from screen center
    const dx = (touch.clientX / size.width) * 2 - 1;
    const dy = (touch.clientY / size.height) * 2 - 1;

    const magnitude = Math.sqrt(dx * dx + dy * dy);

    if (magnitude > 0.1) {
      setVelocity({ x: dx / magnitude, y: dy / magnitude });
    } else {
      setVelocity({ x: 0, y: 0 });
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    isTouchActiveRef.current = true;
    handleTouchMove(e);
  };

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  // Track when player takes damage and trigger hit animation
  useEffect(() => {
    if (playerHealth < previousHealthRef.current) {
      setIsBeingHit(true);
      // Reset hit state after animation duration
      const timer = setTimeout(() => setIsBeingHit(false), 200);
      return () => clearTimeout(timer);
    }
    previousHealthRef.current = playerHealth;
  }, [playerHealth]);

  // Update character when immune to damage (via vaccination)
  useEffect(() => {
    console.log("Immunity state changed:", isPlayerImmuneToDamage);
    setShowImmunityBubble(isPlayerImmuneToDamage);
  }, [isPlayerImmuneToDamage]);

  useControls({
    ...(isTouch
      ? {
          touch: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: () => {
              isTouchActiveRef.current = false;
              setVelocity({ x: 0, y: 0 });
            },
          },
        }
      : {
          keyboard: {
            w: {
              onPress: () =>
                setVelocity((prev) => ({ ...prev, y: prev.y - 1 })),
              onRelease: () =>
                setVelocity((prev) => ({ ...prev, y: prev.y + 1 })),
            },
            s: {
              onPress: () =>
                setVelocity((prev) => ({ ...prev, y: prev.y + 1 })),
              onRelease: () =>
                setVelocity((prev) => ({ ...prev, y: prev.y - 1 })),
            },
            a: {
              onPress: () =>
                setVelocity((prev) => ({ ...prev, x: prev.x - 1 })),
              onRelease: () =>
                setVelocity((prev) => ({ ...prev, x: prev.x + 1 })),
            },
            d: {
              onPress: () =>
                setVelocity((prev) => ({ ...prev, x: prev.x + 1 })),
              onRelease: () =>
                setVelocity((prev) => ({ ...prev, x: prev.x - 1 })),
            },
            ArrowUp: {
              onPress: () =>
                setVelocity((prev) => ({ ...prev, y: prev.y - 1 })),
              onRelease: () =>
                setVelocity((prev) => ({ ...prev, y: prev.y + 1 })),
            },
            ArrowDown: {
              onPress: () =>
                setVelocity((prev) => ({ ...prev, y: prev.y + 1 })),
              onRelease: () =>
                setVelocity((prev) => ({ ...prev, y: prev.y - 1 })),
            },
            ArrowLeft: {
              onPress: () =>
                setVelocity((prev) => ({ ...prev, x: prev.x - 1 })),
              onRelease: () =>
                setVelocity((prev) => ({ ...prev, x: prev.x + 1 })),
            },
            ArrowRight: {
              onPress: () =>
                setVelocity((prev) => ({ ...prev, x: prev.x + 1 })),
              onRelease: () =>
                setVelocity((prev) => ({ ...prev, x: prev.x - 1 })),
            },
          },
        }),
  });

  useFrame((_, delta) => {
    const baseSpeed = 5;
    const speed = baseSpeed * speedMultiplier;
    let vx = velocityRef.current.x;
    let vy = velocityRef.current.y;

    const magnitude = Math.sqrt(vx * vx + vy * vy);
    const isMoving = magnitude > 0;

    // Animate immunity bubble with pulsing effect
    if (immunityBubbleRef.current && showImmunityBubble) {
      const pulseScale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
      immunityBubbleRef.current.scale.set(pulseScale, pulseScale, 1);
    }

    // Track horizontal movement direction for mirroring
    if (vx > 0) {
      setFacingDirection("left");
    } else if (vx < 0) {
      setFacingDirection("right");
    }

    // Mirror the mesh based on facing direction
    if (playerMeshRef.current) {
      playerMeshRef.current.scale.x = facingDirection === "left" ? -1 : 1;
    }

    // Update animation based on state priority: hit > movement > idle
    if (isBeingHit) {
      playAnimation(beingHitAnimation);
    } else if (isMoving) {
      playAnimation(runningAnimation);
    } else {
      playAnimation(idleAnimation);
    }
    updateFrame(delta, characterTexture);

    if (magnitude > 0) {
      vx /= magnitude;
      vy /= magnitude;

      const newPos = {
        x: playerPosition.x + vx * speed * delta,
        y: playerPosition.y - vy * speed * delta,
        z: playerPosition.z,
      };

      // Temporarily move player to check collision per axis
      if (playerMeshRef.current) {
        const originalPos = playerMeshRef.current.position.clone();

        // Check X-axis collision
        let canMoveX = true;
        playerMeshRef.current.position.set(
          newPos.x,
          originalPos.y,
          originalPos.z
        );
        for (const obstacle of obstacleRefs.current) {
          if (obstacle && isColliding(playerMeshRef.current, obstacle)) {
            canMoveX = false;
            break;
          }
        }

        // Check Y-axis collision
        let canMoveY = true;
        playerMeshRef.current.position.set(
          originalPos.x,
          newPos.y,
          originalPos.z
        );
        for (const obstacle of obstacleRefs.current) {
          if (obstacle && isColliding(playerMeshRef.current, obstacle)) {
            canMoveY = false;
            break;
          }
        }

        // Revert position
        playerMeshRef.current.position.copy(originalPos);

        // Move on allowed axes only
        const finalPos = {
          x: canMoveX ? newPos.x : playerPosition.x,
          y: canMoveY ? newPos.y : playerPosition.y,
          z: playerPosition.z,
        };

        movePlayer(finalPos);
      } else {
        movePlayer(newPos);
      }
    }
  });

  return (
    <>
      {/* Immunity bubble/shield */}
      {showImmunityBubble && (
        <mesh
          ref={immunityBubbleRef}
          position={[
            playerPosition.x,
            playerPosition.y,
            playerPosition.z + 0.1,
          ]}
        >
          <circleGeometry args={[1.2, 32]} />
          <meshBasicMaterial
            color="#1b3ae9"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      <mesh
        ref={playerMeshRef}
        name="player-mesh"
        position={[playerPosition.x, playerPosition.y, playerPosition.z]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={characterTexture} transparent />
      </mesh>
    </>
  );
}
