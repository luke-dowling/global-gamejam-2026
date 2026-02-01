import { useTexture } from "@react-three/drei";
import { createContext, useContext, useEffect, useState } from "react";
import * as THREE from "three";
import cougherMale from "../assets/cougher-m.png";
import enemy from "../assets/enemy.png";
import floorGrey from "../assets/floor-grey.png";
import floor from "../assets/floor.png";
import nonCougher from "../assets/non-cougher-m.png";
import playerElon from "../assets/player-elon.png";
import playerSprites from "../assets/player-sprites.png";
import healingPotion from "../assets/powerup-health.png";
import speedUp from "../assets/powerup-speedboost.png";
import vaccine from "../assets/powerup-vaccine.png";
import statusUiHealthHeart from "../assets/status-ui-health-heart.png";
import elonTechBro from "../assets/elon_tech-bro-positive.png";
import elonHater from "../assets/elon_hater-negative.png";
import obstacleFence from "../assets/obstacle_1.png";
import obstaclePuddle from "../assets/obstacle_2.png";
import obstacleBox from "../assets/obstacle_3.png";
import obstacleWell from "../assets/obstacle_4.png";
import obstacleTesla from "../assets/elon_obstacle_1.png";
import obstacleRocket from "../assets/elon_obstacle_2.png";
import obstacleCorp from "../assets/elon_obstacle_3.png";
import obstacleSatelite from "../assets/elon_obstacle_4.png";
import obstacleStrawBall from "../assets/straw_obstacle_1.png";
import obstacleStrawRoll from "../assets/straw_obstacle_2.png";
import obstacleStrawCube from "../assets/straw_obstacle_3.png";
import obstacleStrawPile from "../assets/straw_obstacle_4.png";

import maga from "../assets/powerup-maga.png";
import coin from "../assets/powerup-coin.png";
// import vaccine from "../assets/powerup-vaccine.png";

// All game images - using actual imports to ensure bundler processes them
export const GAME_IMAGES = {
  playerSprites,
  enemy,
  cougherMale,
  nonCougher,
  floor,
  floorGrey,
  statusUiHealthHeart,
  vaccine,
  speedUp,
  healingPotion,
  playerElon,
  elonTechBro,
  elonHater,
  obstacleFence,
  obstaclePuddle,
  obstacleBox,
  obstacleWell,
  obstacleRocket,
  obstacleCorp,
  obstacleSatelite,
  obstacleTesla,
  obstacleStrawBall,
  obstacleStrawCube,
  obstacleStrawPile,
  obstacleStrawRoll,
  maga,
  coin,
};

export type GameTextures = {
  [K in keyof typeof GAME_IMAGES]: THREE.Texture;
};

const TexturesContext = createContext<GameTextures | null>(null);

/**
 * Preloads all game textures for React Three Fiber
 * Call this at the game scene level to prevent lag spikes
 */
export function usePreloadTextures() {
  const [isLoaded, setIsLoaded] = useState(false);

  // useTexture with an object preloads all textures and returns them by key
  const textures = useTexture(GAME_IMAGES);

  // Configure textures once after loading
  useEffect(() => {
    if (!textures) return;

    // Configure all textures with default settings
    Object.values(textures).forEach((texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
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
