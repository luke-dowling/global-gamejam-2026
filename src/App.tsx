import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import Menu from "./Scene/Menu";
import { useSceneManager } from "./components/scene-manager/use-scene-manager";
import SceneManager from "./components/scene-manager";

export default function App() {
  const { switchScene } = useSceneManager();

  // switch scenes every second
  useEffect(() => {
    const interval = setInterval(() => {
      switchScene((prev) => (prev === "test" ? "test2" : "test"));
    }, 1000);
    return () => clearInterval(interval);
  }, [switchScene]);

  return (
    <Menu>
      <div id="canvas-container">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{
            position: [6, 6, 6],
            fov: 45,
            near: 0.1,
            far: 50,
          }}
        >
          <ambientLight intensity={0.35} />

          <directionalLight
            position={[8, 10, 6]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={1}
            shadow-camera-far={30}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <SceneManager />
        </Canvas>
      </div>
    </Menu>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
