import { useMemo } from "react";
import { useGame } from "../../hooks/use-game";
import { useTextures } from "../../hooks/use-textures";
import Collectable from "../collectable";
import { useLevelManager } from "../level-manager/use-level-manager";

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
  const { applySpeedBoost, updateGameEventLog } = useGame();
  const textures = useTextures();
  const activeLevelName = useLevelManager();
  const speedUpTexture = useMemo(() => {
    let textureBase = textures.speedUp;
    switch (activeLevelName.activeLevelName) {
      case "covid":
        break;
      case "elon":
        textureBase = textures.powderbag;
        break;
      case "stroh":
        break;
      default:
        textureBase = textures.speedUp;
    }
    return textureBase;
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
