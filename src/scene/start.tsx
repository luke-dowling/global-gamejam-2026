import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useSceneManager } from "../components/scene-manager/use-scene-manager";
import UIElement from "../components/ui-element";
import { useControls } from "../hooks/use-controls";
import { useGame } from "../hooks/use-game";
import playerSpritesImage from "../assets/player-sprites.png";

export default function Start() {
  const { switchScene } = useSceneManager();
  const { resetPlayer } = useGame();
  const isTouch = useMediaQuery({ query: "(pointer: coarse)" });

  useEffect(() => {
    resetPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToLevelSelect() {
    switchScene("level-select");
  }

  useControls({
    ...(isTouch
      ? {
          touch: {
            onTouchStart: goToLevelSelect,
          },
        }
      : {
          keyboard: {
            " ": goToLevelSelect,
            Enter: goToLevelSelect,
          },
        }),
  });

  return (
    <UIElement>
      <div className="flex flex-col justify-evenly items-center h-full font-pressStart">
        <header>
          <h1 className="text-center main-title">
            MASKED
            <span className="block">RUNNER</span>
          </h1>
        </header>
        <section className="flex items-baseline justify-end-safe gap-24">
          <div
            className="w-96 h-96 sprite-frame sprite-animate flex-shrink-0"
            style={{
              backgroundImage: `url(${playerSpritesImage})`,
              backgroundPosition: "0% 0%",
            }}
          />
          <p className="text-6xl font-pressStart text-white fade-pulse">
            {isTouch ? "Tap to Start" : "Start"}
          </p>
        </section>
      </div>
    </UIElement>
  );
}
