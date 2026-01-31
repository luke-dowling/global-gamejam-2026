import { useLevelManager } from "./components/level-manager/use-level-manager";
import UIElement from "./components/ui-element";

export default function UI() {
  const { activeLevelName } = useLevelManager();
  return (
    <UIElement>
      <div className="flex justify-between text-4xl text-black">
        <div className="border rounded-lg bg-white flex flex-col p-4 m-4">
          <p>Level: 9</p>
          <p>Score: 9000</p>
        </div>
        <div className="border rounded-lg bg-white flex p-4 m-4 gap-2 items-center">
          <div>Icon 1</div>
          <div>Icon 2</div>
          <div>Icon 3</div>
        </div>
        <div className="border rounded-lg bg-white flex p-4 m-4 gap-2 items-center">
          <p>Current Level: {activeLevelName}</p>
        </div>
      </div>
    </UIElement>
  );
}
