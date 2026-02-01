import type { SpriteSheetData } from "../../hooks/use-animation";
import { type Animation } from "../../hooks/use-animation";
import { followPlayer } from "../../utils/movement";
import { useTextures } from "../../hooks/use-textures";
import { useSound } from "../../hooks/use-audio";
import Enemy from "../enemy";
import { useState } from "react";

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
const dyingAnimation: Animation = [
  { x: 4, y: 0, duration: 0.2 },
  { x: 0, y: 0, duration: 0.2 },
];

export default function Cougher({ position, onDestroy }: Props) {
  const textures = useTextures();

  const [breatheSound] = useState(
    (["breathe1", "breathe2", "breathe3"] as const)[
      // eslint-disable-next-line react-hooks/purity
      Math.floor(Math.random() * 3)
    ]
  );

  const audio = useSound(breatheSound);

  const spriteSheet: SpriteSheetData = {
    texture: textures.cougherMale,
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
      movingAnimation={movingAnimation}
      dyingAnimation={dyingAnimation}
      movementBehavior={followPlayer}
      onDestroy={onDestroy}
      onDying={() => audio.play()}
    />
  );
}
