import { Html } from "@react-three/drei";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import playerSpritesImage from "../assets/player-sprites.png";
import { useSceneManager } from "../components/scene-manager/use-scene-manager";
import UIElement from "../components/ui-element";
import { AudioProvider, usePreloadAudio } from "../hooks/use-audio";
import { useControls } from "../hooks/use-controls";
import { useGame } from "../hooks/use-game";

export default function Start() {
  const { isLoaded: audioLoaded, audio } = usePreloadAudio();
  const { resetPlayer } = useGame();

  // Reset player health and state when entering the start scene
  useEffect(() => {
    resetPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!audioLoaded) {
    return (
      <Html center>
        <div style={{ color: "white", fontSize: "24px" }}>Loading...</div>
      </Html>
    );
  }

  return (
    <AudioProvider value={audio}>
      <StartContent />
    </AudioProvider>
  );
}

function StartContent() {
  const { switchScene } = useSceneManager();
  const isTouch = useMediaQuery({ query: "(pointer: coarse)" });
  const { resetPlayer } = useGame();

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
            className="w-96 h-96 sprite-frame sprite-animate shrink-0"
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
