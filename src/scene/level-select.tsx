import UIElement from "../components/ui-element";
import { useControls } from "../hooks/use-controls";
import { useSceneManager } from "../components/scene-manager/use-scene-manager";
import { Lock } from "lucide-react";
import { useLevelManager } from "../components/level-manager/use-level-manager";
import type { LevelName } from "../components/level-manager";

type LevelPreview = {
  levelName: string;
  levelId: LevelName;
  requiredScore: number;
};

const levels: LevelPreview[] = [
  { levelName: "Covid", levelId: "covid", requiredScore: 0 },
  { levelName: "Elon", levelId: "elon", requiredScore: 100 },
  { levelName: "Stroh", levelId: "stroh", requiredScore: 250 },
];

// TODO: This would be read from useAchievements or similar
const currentHighScore = 120;

export default function Menu() {
  const { switchLevel } = useLevelManager();
  const { switchScene } = useSceneManager();

  useControls({
    keyboard: {
      " ": () => switchScene("game"),
      Enter: () => switchScene("game"),
    },
  });

  return (
    <UIElement>
      <div className="flex flex-col justify-evenly items-center h-full font-pressStart">
        <header>
          <h1 className="text-center uppercase tracking-wide py-5 title">
            Select your mask
          </h1>
          <section className="flex justify-center gap-3 py-3 items-center">
            <div className="h-2 w-2 rounded-[50%] bg-white"></div>

            <h2 className="text-2xl uppercase tracking-wide subtitle">
              Choose wisely
            </h2>
            <div className="h-2 w-2 rounded-[50%] bg-white opacity-85"></div>
          </section>
        </header>

        <div className="grid grid-cols-3 gap-16 px-10 w-full max-w-7xl items-end">
          {levels.map((level, index) => {
            const isLocked = currentHighScore < level.requiredScore;
            return (
              <div key={level.levelName} className="flex flex-col items-center">
                {isLocked && (
                  <p className="text-xl font-light text-amber-500 mb-4 text-center">
                    Need a high score of {level.requiredScore}
                  </p>
                )}
                <button
                  onClick={() => {
                    if (!isLocked) {
                      switchLevel(level.levelId);
                      switchScene("game");
                    }
                  }}
                  onTouchEnd={() => {
                    if (!isLocked) {
                      switchScene("game");
                    }
                  }}
                  disabled={isLocked}
                  className={`group relative border-2 ${
                    isLocked
                      ? "border-white/20 bg-white/2 opacity-50 cursor-not-allowed"
                      : "border-white/30 bg-white/5 hover:bg-white/20 hover:border-white/60 cursor-pointer"
                  } transition-all duration-300 px-8 py-16 rounded-lg backdrop-blur-sm flex flex-col justify-center items-center h-125 w-full`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock size={80} className="text-white/60" />
                    </div>
                  )}
                  <div
                    className={`text-9xl font-bold mb-6 ${
                      isLocked ? "opacity-50" : ""
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={`text-4xl font-light uppercase tracking-wider text-center ${
                      isLocked ? "opacity-50" : ""
                    }`}
                  >
                    {level.levelName}
                  </div>
                  {!isLocked && (
                    <div className="absolute inset-0 rounded-lg bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </UIElement>
  );
}
