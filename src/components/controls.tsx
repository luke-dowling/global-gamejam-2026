import { useEffect } from "react";
import { useSceneManager } from "./scene-manager/use-scene-manager";

export default function Controls() {
  const { switchScene } = useSceneManager();

  // TODO: remove this testing code once there is a proper scene switch logic
  useEffect(() => {
    // set up key listener to "s" to switch scenes for testing
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") {
        switchScene("test");
      } else if (event.key === "2") {
        switchScene("test2");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [switchScene]);

  return null;
}
