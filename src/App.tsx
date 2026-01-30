import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";

export default function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
