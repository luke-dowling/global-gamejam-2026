import { useLevelManager } from "./components/level-manager/use-level-manager";
import UIElement from "./components/ui-element";
import { useGame } from "./hooks/use-game";
import healthHeart from "./assets/status-ui-health-heart.png";
import healthDamage from "./assets/status-ui-health-lost.png";

export default function UI() {
  const { activeLevelName } = useLevelManager();
  const { playerHealth } = useGame();
  const maxHealth = 5;

  const healthStates = Array.from({ length: maxHealth }, (_, index) =>
    index < playerHealth ? "healthy" : "damaged"
  );

  return (
    <UIElement>
      <div className="flex justify-between text-4xl text-black">
        <div className="border rounded-lg bg-white flex p-4 m-4 gap-2 items-center">
          <p>Current Level: {activeLevelName}</p>
        </div>
        <div className="border rounded-lg bg-white flex p-4 m-4 gap-2 items-center">
          {healthStates.map((state, index) => (
            <img
              key={index}
              src={state === "healthy" ? healthHeart : healthDamage}
              alt={state}
              className="w-16 h-16 pixelated"
            />
          ))}
        </div>
        <div className="border rounded-lg bg-white flex flex-col p-4 m-4">
          <div>Score: 9000</div>
        </div>
      </div>
    </UIElement>
  );
}
