import Player from "../player";
import UI from "../ui";

export default function Game() {
  return (
    <>
      <UI />
      <Player />

      {/* test object */}
      <mesh position={[0, 1, 0]} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
    </>
  );
}
