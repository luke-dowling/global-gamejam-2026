import { useMemo } from "react";
import { useGame } from "../../hooks/use-game";
import { usePlayerSpeed } from "../../hooks/use-player-speed";
import { useTextures } from "../../hooks/use-textures";
import Collectable from "../collectable";

interface SpeedUpProps {
  position: [number, number];
  speedMultiplier: number;
  duration: number;
  id?: string;
  onCollect?: (id: string) => void;
}

export default function SpeedUp({
  position,
  speedMultiplier,
  duration,
  id,
  onCollect: onCollectCallback,
}: SpeedUpProps) {
  const { applySpeedBoost } = usePlayerSpeed();
  const { updateGameEventLog } = useGame();
  const textures = useTextures();
  const speedUpTexture = useMemo(() => {
    const texture = textures.speedUp.clone();
    return texture;
  }, [textures]);

  function onCollect() {
    updateGameEventLog("Speed Increase!");
    applySpeedBoost(speedMultiplier, duration);
    if (onCollectCallback && id) {
      onCollectCallback(id);
    }
  }

  return (
    <Collectable
      position={position}
      texture={speedUpTexture}
      pickupSound="speedBoost"
      onCollect={onCollect}
    />
  );
}
