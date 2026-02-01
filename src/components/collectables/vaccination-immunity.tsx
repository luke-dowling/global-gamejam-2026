import { useMemo } from "react";
import { useGame } from "../../hooks/use-game";
import { useTextures } from "../../hooks/use-textures";
import Collectable from "../collectable";

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
  const vaccineTexture = useMemo(() => {
    const texture = textures.vaccine.clone();
    return texture;
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
