import LevelManager from "../components/level-manager";
import { LevelManagerProvider } from "../components/level-manager/use-level-manager";
import Player from "../player";

export default function Game() {
  return (
    <>
      <LevelManagerProvider>
        <LevelManager />
        <Player />
      </LevelManagerProvider>
    </>
  );
}
