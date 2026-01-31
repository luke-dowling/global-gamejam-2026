import { useMemo } from "react";
import { useGame } from "../../hooks/use-game";
import { useTextures } from "../../hooks/use-textures";
import Collectable from "../collectable";

interface HealingPotionProps {
  position: [number, number];
  id?: string;
  onCollect?: (id: string) => void;
}

export default function HealingPotion({
  position,
  id,
  onCollect: onCollectCallback,
}: HealingPotionProps) {
  const { healPlayer } = useGame();
  const textures = useTextures();
  const healingPotionTexture = useMemo(() => {
    const texture = textures.healingPotion.clone();
    return texture;
  }, [textures]);

  function onCollect() {
    healPlayer();
    if (onCollectCallback && id) {
      onCollectCallback(id);
    }
  }

  return (
    <Collectable
      position={position}
      texture={healingPotionTexture}
      color="#FF0000"
      onCollect={onCollect}
    />
  );
}
