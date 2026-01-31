import { useGame } from "../../hooks/use-game";
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

  function onCollect() {
    setIsPlayerImmuneToDamage(true);
    setTimeout(() => {
      setIsPlayerImmuneToDamage(false);
    }, 3000);

    if (onCollectCallback && id) {
      onCollectCallback(id);
    }
  }

  return (
    <Collectable position={position} color="#1b3ae9" onCollect={onCollect} />
  );
}
