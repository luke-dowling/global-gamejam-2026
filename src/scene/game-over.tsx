import { Skull } from "lucide-react";
import { useSceneManager } from "../components/scene-manager/use-scene-manager";
import UIElement from "../components/ui-element";
import { useControls } from "../hooks/use-controls";
import { useHighscores } from "../highscore-store";
import type { SceneName } from "../components/scene-manager";
import { useEffect, useState } from "react";
import { useGame } from "../hooks/use-game";
import { AudioProvider, usePreloadAudio, useSound } from "../hooks/use-audio";
import { Html } from "@react-three/drei";

export default function GameOver() {
  const { isLoaded: audioLoaded, audio } = usePreloadAudio();

  if (!audioLoaded) {
    return (
      <Html center>
        <div style={{ color: "white", fontSize: "24px" }}>Loading...</div>
      </Html>
    );
  }

  return (
    <AudioProvider value={audio}>
      <GameOverContent />
    </AudioProvider>
  );
}

function GameOverContent() {
  const { switchScene } = useSceneManager();
  const [hasError, setHasError] = useState(false);
  const [name, setName] = useState("");
  const { playerPoints } = useGame();
  const gameOverThemeSound = useSound("gameOverTheme");

  useEffect(() => {
    gameOverThemeSound.setVolume(1);
    gameOverThemeSound.setLoop(true);
    gameOverThemeSound.play().catch((error) => {
      console.error("Failed to play game over music:", error);
    });

    return () => {
      gameOverThemeSound.stop();
    };
  }, [gameOverThemeSound]);

  useControls({
    keyboard: {
      " ": () => handleContinue("highscore"),
      Enter: () => handleContinue("highscore"),
    },
  });
  const addHighscore = useHighscores((s) => s.addHighscore);
  const handleContinue = (scene: SceneName) => {
    if (!name.trim()) {
      setHasError(true);
      return;
    }
    setHasError(false);
    addHighscore({
      name: name.trim(),
      points: playerPoints,
    });

    switchScene(scene);
  };

  return (
    <UIElement>
      <div className="flex flex-col justify-evenly items-center h-full font-pressStart">
        <header>
          <section className="flex justify-center gap-1 py-3 items-center">
            <div className="w-20 border-b-2 border-white"></div>
            <Skull size={48} />
            <div className="w-20 border-b-2 border-white"></div>
          </section>
          <h1 className="text-center uppercase tracking-wide py-5 title">
            Game Over
          </h1>
          <section className="flex justify-center gap-3 py-3 items-center">
            <div className="h-2 w-2 rounded-[50%] bg-white"></div>

            <h2 className="text-2xl uppercase tracking-wide subtitle">
              You died
            </h2>
            <div className="h-2 w-2 rounded-[50%] bg-white opacity-85"></div>
          </section>
          <section className="flex justify-center gap-3 py-3 items-center">
            <input
              className={[
                "rounded-md border px-3 py-2 text-white outline-none transition-colors",
                "bg-slate-900",
                hasError
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-600 focus:border-emerald-400",
              ].join(" ")}
              placeholder="enter name for scoreboard"
              type="text"
              onChange={(e) => {
                setName(e.target.value);
                if (hasError) setHasError(false);
              }}
              autoFocus
            />
          </section>
        </header>

        <div className="flex gap-8">
          <button
            onClick={() => handleContinue("highscore")}
            onTouchEnd={() => handleContinue("highscore")}
            className="group relative border-2 border-white/30 bg-white/5 hover:bg-white/20 hover:border-white/60 transition-all duration-300 px-8 py-4 rounded-lg backdrop-blur-sm cursor-pointer flex flex-col justify-center items-center"
          >
            <div className="text-2xl font-light uppercase tracking-wider text-center">
              Highscore
            </div>
            <div className="absolute inset-0 rounded-lg bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
          </button>

          <button
            onClick={() => handleContinue("level-select")}
            onTouchEnd={() => handleContinue("level-select")}
            className="group relative border-2 border-white/30 bg-white/5 hover:bg-white/20 hover:border-white/60 transition-all duration-300 px-8 py-4 rounded-lg backdrop-blur-sm cursor-pointer flex flex-col justify-center items-center"
          >
            <div className="text-2xl font-light uppercase tracking-wider text-center">
              Back to Menu
            </div>
            <div className="absolute inset-0 rounded-lg bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
          </button>
        </div>

        {/* <p className="text-2xl font-extralight text-white/60">
          Press Space to return to start
        </p> */}
      </div>
    </UIElement>
  );
}
