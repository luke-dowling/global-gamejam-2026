import { useFrame } from "@react-three/fiber";
import { VenetianMask } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useSceneManager } from "../components/scene-manager/use-scene-manager";
import UIElement from "../components/ui-element";
import { useControls } from "../hooks/use-controls";
import { useGame } from "../hooks/use-game";

export default function Start() {
  const { switchScene } = useSceneManager();
  const { resetPlayer } = useGame();
  const isTouch = useMediaQuery({ query: "(pointer: coarse)" });
  const pressSpaceRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    resetPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startGame() {
    switchScene("game");
  }

  useControls({
    ...(isTouch
      ? {
          touch: {
            onTouchStart: startGame,
          },
        }
      : {
          keyboard: {
            // Todo: change game to menu when the game is ready
            " ": startGame,
            Enter: startGame,
          },
        }),
  });

  useFrame(({ clock }) => {
    if (pressSpaceRef.current) {
      const fade = Math.sin(clock.getElapsedTime() * 1.5) * 0.35 + 0.65;
      pressSpaceRef.current.style.opacity = fade.toString();
    }
  });

  return (
    <UIElement>
      <div className="flex flex-col justify-evenly items-center h-full">
        <header>
          <section className="flex justify-center gap-1 py-3 items-center">
            <div className="w-20 border-b-2 border-white"></div>
            <VenetianMask size={48} />
            <div className="w-20 border-b-2 border-white"></div>
          </section>
          <h1 className="text-center uppercase text-8xl  tracking-wide font-bold text-white drop-shadow-lg py-5">
            Masks
          </h1>
          <section className="flex justify-center gap-3 py-3 items-center">
            <div className="h-2 w-2 rounded-[50%] bg-white"></div>

            <h2 className="text-3xl font-light drop-shadow-lg uppercase tracking-wide">
              A 2.5d Adventure
            </h2>
            <div className="h-2 w-2 rounded-[50%] bg-white opacity-85"></div>
          </section>
        </header>
        <p ref={pressSpaceRef} className="text-3xl font-extralight">
          {isTouch ? "Tap to Start" : "Press Space or Enter to Start"}
        </p>
      </div>
    </UIElement>
  );
}
