import { useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";
import caugherMaleImage from "../assets/caugher-m.png";
import enemyImage from "../assets/enemy.png";
import floorGreyImage from "../assets/floor-grey.png";
import floorImage from "../assets/floor.png";
import playerSpritesImage from "../assets/player-sprites.png";
import statusUiHealthHeartImage from "../assets/status-ui-health-heart.png";

// All game images - using actual imports to ensure bundler processes them
export const GAME_IMAGES = [
  playerSpritesImage,
  enemyImage,
  caugherMaleImage,
  floorImage,
  floorGreyImage,
  statusUiHealthHeartImage,
];

/**
 * Preloads all game textures for React Three Fiber
 * Call this at the level start or app initialization to prevent lag spikes
 */
export function usePreloadTextures() {
  const [isLoaded, setIsLoaded] = useState(false);

  // useTexture with an array preloads all textures
  const textures = useTexture(GAME_IMAGES);

  useEffect(() => {
    if (textures) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoaded(true);
    }
  }, [textures]);

  return { isLoaded, textures };
}

/**
 * Alternative: Manually preload images using Image objects
 * Useful if you need to preload before React Three Fiber mounts
 */
export function preloadImages(imagePaths: string[]): Promise<void[]> {
  const loadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  };

  return Promise.all(imagePaths.map(loadImage));
}
