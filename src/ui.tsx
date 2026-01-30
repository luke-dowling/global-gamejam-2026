import { Html } from "@react-three/drei";

export default function UI() {
  return (
    <Html position={[0, 0, 0]} transform={false} fullscreen>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
        className="border rounded-lg bg-white text-blue-500"
      >
        Level: over 9000
      </div>
    </Html>
  );
}
