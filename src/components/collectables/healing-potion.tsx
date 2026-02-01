import { useMemo } from "react";
import { useGame } from "../../hooks/use-game";
import { useTextures } from "../../hooks/use-textures";
import Collectable from "../collectable";
import { useLevelManager } from "../level-manager/use-level-manager";

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
  const activeLevelName = useLevelManager();
  const healingPotionTexture = useMemo(() => {
    let textureBase = textures.healingPotion;
    switch (activeLevelName.activeLevelName) {
      case "covid":
        break;
      case "elon":
        textureBase = textures.coin;
        break;
      case "stroh":
        textureBase = textures.fusebox;
        break;
      default:
        textureBase = textures.healingPotion;
    }
    return textureBase;
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
      pickupSound="apple"
      onCollect={onCollect}
    />
  );
}
