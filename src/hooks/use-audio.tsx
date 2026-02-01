import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import coinSound from "../assets/audio/effects/retro-coin.mp3";
import mainTheme from "../assets/audio/main-theme.mp3";
import breathe1 from "../assets/audio/effects/breathe1.wav";
import breathe2 from "../assets/audio/effects/breathe2.wav";
import breathe3 from "../assets/audio/effects/breathe3.wav";

// All game audio files - using actual imports to ensure bundler processes them
const GAME_AUDIO = {
  coinSound,
  mainTheme,
  breathe1,
  breathe2,
  breathe3,
};

export type GameAudio = {
  [K in keyof typeof GAME_AUDIO]: HTMLAudioElement;
};

const AudioContext = createContext<GameAudio | null>(null);

/**
 * Preloads all game audio files
 * Call this at the game scene level to prevent lag spikes and multiple network requests
 */
// eslint-disable-next-line react-refresh/only-export-components
export function usePreloadAudio() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [audio, setAudio] = useState<GameAudio | null>(null);

  useEffect(() => {
    const audioElements: Partial<GameAudio> = {};
    const loadPromises: Promise<void>[] = [];

    // Create and preload all audio elements
    Object.entries(GAME_AUDIO).forEach(([key, src]) => {
      const audioElement = new Audio(src);
      audioElement.preload = "auto";

      // Create a promise that resolves when the audio can play
      const loadPromise = new Promise<void>((resolve, reject) => {
        audioElement.addEventListener("canplaythrough", () => resolve(), {
          once: true,
        });
        audioElement.addEventListener("error", reject, { once: true });
      });

      loadPromises.push(loadPromise);
      audioElements[key as keyof GameAudio] = audioElement;
    });

    // Wait for all audio to load
    Promise.all(loadPromises)
      .then(() => {
        setAudio(audioElements as GameAudio);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to preload audio:", error);
      });
  }, []);

  return { isLoaded, audio };
}

export const AudioProvider = AudioContext.Provider;

/**
 * Access preloaded audio from anywhere in the component tree
 */
function useAudio() {
  const audio = useContext(AudioContext);
  if (!audio) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return audio;
}

/**
 * Helper hook to play a specific audio file from the preloaded audio
 * Clones the preloaded audio element for each play to support simultaneous playback
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useSound(soundKey: keyof GameAudio) {
  const audio = useAudio();
  const audioElement = audio[soundKey];

  const play = useCallback(async () => {
    if (audioElement) {
      // Clone the audio element so multiple instances can play simultaneously
      const clone = audioElement.cloneNode() as HTMLAudioElement;
      clone.currentTime = 0;
      try {
        await clone.play();
      } catch (error) {
        console.error("Failed to play sound:", error);
      }
    }
  }, [audioElement]);

  const pause = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
    }
  }, [audioElement]);

  const stop = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  }, [audioElement]);

  const setVolume = useCallback(
    (volume: number) => {
      if (audioElement) {
        audioElement.volume = Math.max(0, Math.min(1, volume));
      }
    },
    [audioElement]
  );

  const setPlaybackRate = useCallback(
    (rate: number) => {
      if (audioElement) {
        audioElement.playbackRate = rate;
      }
    },
    [audioElement]
  );

  return {
    play,
    pause,
    stop,
    setVolume,
    setPlaybackRate,
  };
}
