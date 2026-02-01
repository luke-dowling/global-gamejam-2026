import { useFrame } from "@react-three/fiber";
import { VenetianMask } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useSceneManager } from "../components/scene-manager/use-scene-manager";
import UIElement from "../components/ui-element";
import { useControls } from "../hooks/use-controls";
import { useGame } from "../hooks/use-game";
import { useHighscores } from "../highscore-store";

export default function Highscore() {
  const highscores = useHighscores((s) => s.highscores);
  const { switchScene } = useSceneManager();
  const { resetPlayer } = useGame();
  const isTouch = useMediaQuery({ query: "(pointer: coarse)" });
  const pressSpaceRef = useRef<HTMLParagraphElement>(null);

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
            Highscore
          </h1>
          <section className="flex justify-center gap-3 py-3 items-center">
            <div className="h-2 w-2 rounded-[50%] bg-white"></div>
            <div className="h-2 w-2 rounded-[50%] bg-white opacity-85"></div>
          </section>
          <section className="flex justify-center gap-3 py-3 items-center">
            <div className="border rounded-lg text-2xl">
              <table>
                <thead>
                  <tr className="border-b border-slate-700 text-slate-300">
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {highscores.map((entry, index) => (
                    <tr
                      key={`${entry.name}-${index}`}
                      className="border-b border-slate-800 last:border-none"
                    >
                      <td className="px-3 py-2 text-slate-400">{index + 1}</td>
                      <td className="px-3 py-2 text-white">{entry.name}</td>
                      <td className="px-3 py-2 text-right font-mono text-emerald-400">
                        {entry.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </header>

        <div className="flex gap-8">
          <button
            onClick={() => switchScene("game")}
            onTouchEnd={() => switchScene("game")}
            className="group relative border-2 border-white/30 bg-white/5 hover:bg-white/20 hover:border-white/60 transition-all duration-300 px-8 py-4 rounded-lg backdrop-blur-sm cursor-pointer flex flex-col justify-center items-center"
          >
            <div className="text-2xl font-light uppercase tracking-wider text-center">
              Try Again
            </div>
            <div className="absolute inset-0 rounded-lg bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
          </button>
          <button
            onClick={() => switchScene("level-select")}
            onTouchEnd={() => switchScene("level-select")}
            className="group relative border-2 border-white/30 bg-white/5 hover:bg-white/20 hover:border-white/60 transition-all duration-300 px-8 py-4 rounded-lg backdrop-blur-sm cursor-pointer flex flex-col justify-center items-center"
          >
            <div className="text-2xl font-light uppercase tracking-wider text-center">
              Back to Menu
            </div>
            <div className="absolute inset-0 rounded-lg bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
          </button>
        </div>
      </div>
    </UIElement>
  );
}
