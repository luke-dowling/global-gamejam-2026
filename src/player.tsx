import { useGame } from "./hooks/use-game";

export default function Player() {
  const { playerPosition } = useGame();
  return (
    <mesh position={[playerPosition.x, playerPosition.y, playerPosition.z]}>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
