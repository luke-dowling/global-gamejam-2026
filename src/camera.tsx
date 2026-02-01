import { OrthographicCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { useGame } from "./hooks/use-game";
import UI from "./ui";

const VIRTUAL_WIDTH = 16;
const VIRTUAL_HEIGHT = 9;

export default function Camera() {
  const { playerPosition } = useGame();
  const { size } = useThree();

  const zoom = useMemo(() => {
    const scaleX = size.width / VIRTUAL_WIDTH;
    const scaleY = size.height / VIRTUAL_HEIGHT;

    // Pick the smaller scale so nothing gets cropped
    return Math.min(scaleX, scaleY);
  }, [size]);

  return (
    <OrthographicCamera
      makeDefault
      position={[playerPosition.x, playerPosition.y, playerPosition.z + 1]}
      zoom={zoom}
    >
      <UI />
    </OrthographicCamera>
  );
}
