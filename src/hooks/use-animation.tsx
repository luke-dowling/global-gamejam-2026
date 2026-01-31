import { useRef, useState } from "react";
import * as THREE from "three";

export type SpriteSheetData = {
  url: string;
  tileWidth: number;
  tileHeight: number;
  rows: number;
  cols: number;
};

export type Frame = {
  x: number;
  y: number;
  duration: number;
};

export type Animation = Frame[];

export function useAnimation(
  spriteSheet: SpriteSheetData,
  initialAnimation: Animation,
) {
  const [activeAnimation, setActiveAnimation] =
    useState<Animation>(initialAnimation);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const animationTimeRef = useRef(0);

  const playAnimation = (animation: Animation) => {
    if (activeAnimation !== animation) {
      setActiveAnimation(animation);
      setCurrentFrameIndex(0);
      animationTimeRef.current = 0;
    }
  };

  const updateFrame = (delta: number, texture: THREE.Texture | null) => {
    const currentFrame = activeAnimation[currentFrameIndex];

    // Update animation frame
    animationTimeRef.current += delta;
    if (animationTimeRef.current >= currentFrame.duration) {
      animationTimeRef.current = 0;
      setCurrentFrameIndex((prev) => (prev + 1) % activeAnimation.length);
    }

    // Update texture offset based on current frame
    if (texture) {
      texture.offset.set(
        currentFrame.x / spriteSheet.cols,
        1 - (currentFrame.y + 1) / spriteSheet.rows,
      );
    }
  };

  return { playAnimation, updateFrame };
}
