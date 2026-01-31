import { usePlayerSpeed } from "../../hooks/use-player-speed";
import Collectable from "../collectable";

interface SpeedUpProps {
  position: [number, number];
  speedMultiplier: number;
  duration: number;
}

export default function SpeedUp({
  position,
  speedMultiplier,
  duration,
}: SpeedUpProps) {
  const { applySpeedBoost } = usePlayerSpeed();

  function onCollect() {
    applySpeedBoost(speedMultiplier, duration);
  }

  return (
    <Collectable position={position} color="#00FF00" onCollect={onCollect} />
  );
}
