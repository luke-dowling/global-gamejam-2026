import { useEffect } from "react";
import { useSceneManager } from "./scene-manager/use-scene-manager";

export default function Controls() {
  const { activeSceneName, switchScene } = useSceneManager();

  // TODO: remove this testing code once there is a proper scene switch logic
  useEffect(() => {
    // set up key listener to "s" to switch scenes for testing
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeSceneName === "start") {
        if (event.key === " ") {
          switchScene("game");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSceneName, switchScene]);

  return null;
}
