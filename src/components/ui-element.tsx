import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

type Props = {
  children: React.ReactNode;
};

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

export default function UIElement({ children }: Props) {
  const { size } = useThree();

  const scale = Math.min(size.width / BASE_WIDTH, size.height / BASE_HEIGHT);

  return (
    <Html
      style={{
        transform: `scale(${scale}) translate(-50%, -50%)`,
        transformOrigin: "top left",
        // TODO: re-enable pointer events on interactive elements
        // pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
        }}
      >
        {children}
      </div>
    </Html>
  );
}
