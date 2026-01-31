import { useTexture } from "@react-three/drei";
import { createContext, useContext, useEffect, useState } from "react";
import * as THREE from "three";
import cougherMaleImage from "../assets/cougher-m.png";
import enemyImage from "../assets/enemy.png";
import floorGreyImage from "../assets/floor-grey.png";
import floorImage from "../assets/floor.png";
import vaccineImage from "../assets/powerup-vaccine.png";
import speedUpImage from "../assets/powerup-speedboost.png";
import healingPotionImage from "../assets/powerup-health.png";
import playerSpritesImage from "../assets/player-sprites.png";
import statusUiHealthHeartImage from "../assets/status-ui-health-heart.png";

// All game images - using actual imports to ensure bundler processes them
export const GAME_IMAGES = {
  playerSprites: playerSpritesImage,
  enemy: enemyImage,
  cougherMale: cougherMaleImage,
  floor: floorImage,
  floorGrey: floorGreyImage,
  statusUiHealthHeart: statusUiHealthHeartImage,
  vaccine: vaccineImage,
  speedUp: speedUpImage,
  healingPotion: healingPotionImage,
};

export type GameTextures = {
  playerSprites: THREE.Texture;
  enemy: THREE.Texture;
  cougherMale: THREE.Texture;
  floor: THREE.Texture;
  floorGrey: THREE.Texture;
  statusUiHealthHeart: THREE.Texture;
  vaccine: THREE.Texture;
  speedUp: THREE.Texture;
  healingPotion: THREE.Texture;
};

const TexturesContext = createContext<GameTextures | null>(null);

/**
 * Preloads all game textures for React Three Fiber
 * Call this at the game scene level to prevent lag spikes
 */
export function usePreloadTextures() {
  const [isLoaded, setIsLoaded] = useState(false);

  // useTexture with an object preloads all textures and returns them by key
  const textures = useTexture(GAME_IMAGES) as GameTextures;

  // Configure textures once after loading
  useEffect(() => {
    if (!textures) return;

    // Configure player sprites
    textures.playerSprites.magFilter = THREE.NearestFilter;
    textures.playerSprites.minFilter = THREE.NearestFilter;
    textures.playerSprites.wrapS = THREE.RepeatWrapping;
    textures.playerSprites.wrapT = THREE.RepeatWrapping;

    // Configure enemy texture
    textures.enemy.magFilter = THREE.NearestFilter;
    textures.enemy.minFilter = THREE.NearestFilter;
    textures.enemy.wrapS = THREE.RepeatWrapping;
    textures.enemy.wrapT = THREE.RepeatWrapping;

    // Configure cougher texture
    textures.cougherMale.magFilter = THREE.NearestFilter;
    textures.cougherMale.minFilter = THREE.NearestFilter;
    textures.cougherMale.wrapS = THREE.RepeatWrapping;
    textures.cougherMale.wrapT = THREE.RepeatWrapping;

    // Configure floor textures
    textures.floor.magFilter = THREE.NearestFilter;
    textures.floor.minFilter = THREE.NearestFilter;
    textures.floor.wrapS = THREE.RepeatWrapping;
    textures.floor.wrapT = THREE.RepeatWrapping;

    textures.floorGrey.magFilter = THREE.NearestFilter;
    textures.floorGrey.minFilter = THREE.NearestFilter;
    textures.floorGrey.wrapS = THREE.RepeatWrapping;
    textures.floorGrey.wrapT = THREE.RepeatWrapping;

    setIsLoaded(true);
  }, [textures]);

  return { isLoaded, textures };
}

export const TexturesProvider = TexturesContext.Provider;

/**
 * Access preloaded textures from anywhere in the component tree
 */
export function useTextures() {
  const textures = useContext(TexturesContext);
  if (!textures) {
    throw new Error("useTextures must be used within a TexturesProvider");
  }
  return textures;
}
