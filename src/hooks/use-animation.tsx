import { useRef } from "react";
import * as THREE from "three";

export type SpriteSheetData = {
  url?: string; // Optional now, for backward compatibility
  texture?: THREE.Texture; // New way to pass texture directly
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
  initialAnimation: Animation
) {
  const activeAnimationRef = useRef<Animation>(initialAnimation);
  const currentFrameIndexRef = useRef(0);
  const animationTimeRef = useRef(0);

  const playAnimation = (animation: Animation) => {
    if (activeAnimationRef.current !== animation) {
      activeAnimationRef.current = animation;
      currentFrameIndexRef.current = 0;
      animationTimeRef.current = 0;
    }
  };

  const updateFrame = (delta: number, texture: THREE.Texture | null) => {
    const currentFrame =
      activeAnimationRef.current[currentFrameIndexRef.current];

    // Update animation frame
    animationTimeRef.current += delta;
    if (animationTimeRef.current >= currentFrame.duration) {
      animationTimeRef.current = 0;
      currentFrameIndexRef.current =
        (currentFrameIndexRef.current + 1) % activeAnimationRef.current.length;
    }

    // Update texture offset based on current frame
    if (texture) {
      texture.offset.set(
        currentFrame.x / spriteSheet.cols,
        1 - (currentFrame.y + 1) / spriteSheet.rows
      );
    }
  };

  return { playAnimation, updateFrame };
}
