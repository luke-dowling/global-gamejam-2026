import UIElement from "../components/ui-element";
import { useControls } from "../hooks/use-controls";
import { useSceneManager } from "../components/scene-manager/use-scene-manager";
import { Lock } from "lucide-react";

export default function Menu() {
  const { switchScene } = useSceneManager();

  useControls({
    keyboard: {
      " ": () => switchScene("game"),
      Enter: () => switchScene("game"),
    },
  });

  return (
    <UIElement>
      <div className="flex flex-col justify-evenly items-center h-full">
        <header>
          <h1 className="text-center uppercase text-8xl  tracking-wide font-bold text-white drop-shadow-lg py-5">
            Select your mask
          </h1>
          <section className="flex justify-center gap-3 py-3 items-center">
            <div className="h-2 w-2 rounded-[50%] bg-white"></div>

            <h2 className="text-3xl font-light drop-shadow-lg uppercase tracking-wide">
              Choose wisely
            </h2>
            <div className="h-2 w-2 rounded-[50%] bg-white opacity-85"></div>
          </section>
        </header>

        <div className="grid grid-cols-3 gap-16 px-10 w-full max-w-7xl">
          <div className="flex flex-col items-center">
            <button
              onClick={() => switchScene("game")}
              onTouchEnd={() => switchScene("game")}
              className="group relative border-2 border-white/30 bg-white/5 hover:bg-white/20 hover:border-white/60 transition-all duration-300 px-8 py-16 rounded-lg backdrop-blur-sm cursor-pointer flex flex-col justify-center items-center h-125 w-full"
            >
              <div className="text-9xl font-bold mb-6">1</div>
              <div className="text-4xl font-light uppercase tracking-wider text-center">
                Level One
              </div>
              <div className="absolute inset-0 rounded-lg bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xl font-light text-white/70 mb-4 text-center">
              Need a high score of 100
            </p>
            <button
              disabled
              className="group relative border-2 border-white/20 bg-white/2 opacity-50 cursor-not-allowed px-8 py-16 rounded-lg backdrop-blur-sm flex flex-col justify-center items-center h-125 w-full"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={80} className="text-white/60" />
              </div>
              <div className="text-9xl font-bold mb-6 opacity-50">2</div>
              <div className="text-4xl font-light uppercase tracking-wider text-center opacity-50">
                Level Two
              </div>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xl font-light text-white/70 mb-4 text-center">
              Need a high score of 250
            </p>
            <button
              disabled
              className="group relative border-2 border-white/20 bg-white/2 opacity-50 cursor-not-allowed px-8 py-16 rounded-lg backdrop-blur-sm flex flex-col justify-center items-center h-125 w-full"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={80} className="text-white/60" />
              </div>
              <div className="text-9xl font-bold mb-6 opacity-50">3</div>
              <div className="text-4xl font-light uppercase tracking-wider text-center opacity-50">
                Level Three
              </div>
            </button>
          </div>
        </div>
      </div>
    </UIElement>
  );
}
