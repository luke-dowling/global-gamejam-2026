import type { SpriteSheetData } from "../../hooks/use-animation";
import { type Animation } from "../../hooks/use-animation";
import { useTextures } from "../../hooks/use-textures";
import { followPlayer } from "../../utils/movement";
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

export default function Hater({ position, onDestroy }: Props) {
  const textures = useTextures();

  const spriteSheet: SpriteSheetData = {
    texture: textures.elonHater,
    tileWidth: 32,
    tileHeight: 32,
    rows: 1,
    cols: 5,
  };

  return (
    <Enemy
      position={position}
      speed={1.4}
      spriteSheet={spriteSheet}
      idleAnimation={idleAnimation}
      movingAnimation={movingAnimation}
      movementBehavior={followPlayer}
      onDestroy={onDestroy}
    />
  );
}
