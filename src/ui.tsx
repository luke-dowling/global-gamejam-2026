import { useLevelManager } from "./components/level-manager/use-level-manager";
import UIElement from "./components/ui-element";
import { useGame } from "./hooks/use-game";

export default function UI() {
  const { activeLevelName } = useLevelManager();
  const { playerHealth, gameEventLog } = useGame();

  return (
    <UIElement>
      <div className="flex justify-between text-4xl text-black">
        <div className="border rounded-lg bg-white flex p-4 m-4 gap-2 items-center">
          <p>Health: {playerHealth}</p>
        </div>
        <div className="border rounded-lg bg-white flex p-4 m-4 gap-3 min-w-96 items-center">
          {gameEventLog.length > 0 ? (
            gameEventLog.map((state, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-500 bg-gray-50 px-3 py-2 rounded shadow-sm"
              >
                {state}
              </div>
            ))
          ) : (
            <div className="text-gray-400 italic">No events yet...</div>
          )}
        </div>
        <div className="border rounded-lg bg-white flex p-4 m-4 gap-2 items-center">
          <p>Current Level: {activeLevelName}</p>
        </div>
      </div>
    </UIElement>
  );
}
