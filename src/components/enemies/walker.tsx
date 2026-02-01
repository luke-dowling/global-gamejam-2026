import { useMemo } from "react";
import type { SpriteSheetData } from "../../hooks/use-animation";
import { type Animation } from "../../hooks/use-animation";
import { useGame } from "../../hooks/use-game";
import { walkInDirection } from "../../utils/movement";
import { useTextures } from "../../hooks/use-textures";
import Enemy from "../enemy";

type Props = {
  position: [number, number];
  onDestroy?: () => void;
};

const idleAnimation: Animation = [{ x: 0, y: 0, duration: 0.2 }];
const movingAnimation: Animation = [
  { x: 1, y: 0, duration: 0.1 },
  { x: 2, y: 0, duration: 0.15 },
  { x: 3, y: 0, duration: 0.1 },
  { x: 2, y: 0, duration: 0.15 },
];

export default function Walker({ position, onDestroy }: Props) {
  const { playerPosition } = useGame();
  const textures = useTextures();

  const spriteSheet: SpriteSheetData = {
    texture: textures.nonCougher,
    tileWidth: 32,
    tileHeight: 32,
    rows: 1,
    cols: 5,
  };

  // Calculate direction towards player on spawn and lock it
  const movementBehavior = useMemo(() => {
    const dx = playerPosition.x - position[0];
    const dy = playerPosition.y - position[1];
    const distance = Math.sqrt(dx * dx + dy * dy);

    const directionX = distance > 0 ? dx / distance : 0;
    const directionY = distance > 0 ? dy / distance : 0;

    return walkInDirection(directionX, directionY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - explicitely only calculate once on mount

  return (
    <Enemy
      position={position}
      speed={1.2}
      spriteSheet={spriteSheet}
      idleAnimation={idleAnimation}
      movingAnimation={movingAnimation}
      movementBehavior={movementBehavior}
      onDestroy={onDestroy}
      isFriendly={true}
    />
  );
}
