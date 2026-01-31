import type { SpriteSheetData } from "../../hooks/use-animation";
import { type Animation } from "../../hooks/use-animation";
import { followPlayer } from "../../utils/movement";
import { useTextures } from "../../hooks/use-textures";
import Enemy from "../enemy";

type Props = {
  position: [number, number];
  onDestroy?: () => void;
};

const idleAnimation: Animation = [{ x: 0, y: 0, duration: 0.2 }];

export default function Caugher({ position, onDestroy }: Props) {
  const textures = useTextures();

  const spriteSheet: SpriteSheetData = {
    texture: textures.caugherMale,
    tileWidth: 32,
    tileHeight: 32,
    rows: 1,
    cols: 5,
  };

  return (
    <Enemy
      position={position}
      speed={1.5}
      spriteSheet={spriteSheet}
      idleAnimation={idleAnimation}
      // TODO: add moving animation
      // movingAnimation={movingAnimation}
      movementBehavior={followPlayer}
      onDestroy={onDestroy}
    />
  );
}
