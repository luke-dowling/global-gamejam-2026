import { useMemo } from "react";
import { useGame } from "../../hooks/use-game";
import { useTextures } from "../../hooks/use-textures";
import Collectable from "../collectable";
import { useLevelManager } from "../level-manager/use-level-manager";

interface VaccinationImmunityProps {
  position: [number, number];
  id?: string;
  onCollect?: (id: string) => void;
}

export default function VaccinationImmunity({
  position,
  id,
  onCollect: onCollectCallback,
}: VaccinationImmunityProps) {
  const { applyImmunityBoost, updateGameEventLog } = useGame();
  const textures = useTextures();
  const activeLevelName = useLevelManager();
  const vaccineTexture = useMemo(() => {
    let textureBase = textures.vaccine;
    switch (activeLevelName.activeLevelName) {
      case "covid":
        break;
      case "elon":
        textureBase = textures.maga;
        break;
      case "stroh":
        break;
      default:
        textureBase = textures.vaccine;
    }
    return textureBase;
  }, [textures]);

  function onCollect() {
    updateGameEventLog("Immunity Active!");
    applyImmunityBoost(3);

    if (onCollectCallback && id) {
      onCollectCallback(id);
    }
  }

  return (
    <Collectable
      position={position}
      texture={vaccineTexture}
      pickupSound="vaccine"
      onCollect={onCollect}
    />
  );
}
