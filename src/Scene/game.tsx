import Player from "../player";
import UI from "../ui";

export default function Game() {
  return (
    <>
      <UI score={9000} level={9} />
      <Player />
    </>
  );
}
