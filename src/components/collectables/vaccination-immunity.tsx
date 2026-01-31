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
  const { setIsPlayerImmuneToDamage } = useGame();
  const textures = useTextures();
  const vaccineTexture = useMemo(() => {
    const texture = textures.vaccine.clone();
    return texture;
  }, [textures]);

  function onCollect() {
    // * player doesnt take any damage for 3 seconds
    setIsPlayerImmuneToDamage(true);
    setTimeout(() => {
      setIsPlayerImmuneToDamage(false);
    }, 3000);

    if (onCollectCallback && id) {
      onCollectCallback(id);
    }
  }

  return (
    <Collectable
      position={position}
      texture={vaccineTexture}
      color="#1b3ae9"
      onCollect={onCollect}
    />
  );
}
