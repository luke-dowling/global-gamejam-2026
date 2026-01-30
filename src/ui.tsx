import UIElement from "./components/ui-element";

type UIProps = {
  level: number;
  score: number;
};

export default function UI(props: UIProps) {
  return (
    <UIElement>
      <div className="flex justify-between text-4xl">
        <div className="border rounded-lg bg-white text-blue-500 flex flex-col p-2 m-4">
          <p>Level: {props.level}</p>
          <p>Score: {props.score}</p>
        </div>
        <div className="border rounded-lg bg-white text-red-500 flex p-2 m-4 gap-2 items-center">
          <div>Icon 1</div>
          <div>Icon 2</div>
          <div>Icon 3</div>
        </div>
      </div>
    </UIElement>
  );
}
