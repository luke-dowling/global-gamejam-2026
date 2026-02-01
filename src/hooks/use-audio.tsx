import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import covidTheme from "../assets/audio/covid-theme.mp3";
import elonTheme from "../assets/audio/elon-theme.mp3";
import strohTheme from "../assets/audio/stroh-theme.mp3";
import gameOverTheme from "../assets/audio/game-over-theme.mp3";
import menuTheme from "../assets/audio/menu-theme.mp3";
import breathe1 from "../assets/audio/effects/breathe1.wav";
import breathe2 from "../assets/audio/effects/breathe2.wav";
import breathe3 from "../assets/audio/effects/breathe3.wav";
import vaccine from "../assets/audio/effects/vaccine.wav";
import speedBoost from "../assets/audio/effects/speed-boost.wav";
import apple from "../assets/audio/effects/apple.wav";

// All game audio files - using actual imports to ensure bundler processes them
const GAME_AUDIO = {
  covidTheme,
  elonTheme,
  strohTheme,
  gameOverTheme,
  menuTheme,
  breathe1,
  breathe2,
  breathe3,
  vaccine,
  speedBoost,
  apple,
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
    let isMounted = true;
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
        if (isMounted) {
          setAudio(audioElements as GameAudio);
          setIsLoaded(true);
        }
      })
      .catch((error) => {
        console.error("Failed to preload audio:", error);
        if (isMounted) {
          // Still set the audio elements even if some failed to load
          // This prevents the app from being stuck in loading state
          setAudio(audioElements as GameAudio);
          setIsLoaded(true);
        }
      });

    return () => {
      isMounted = false;
      // Clean up audio elements to prevent memory leaks
      Object.values(audioElements).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
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
    throw new Error(
      "useAudio must be used within an AudioProvider. Make sure audio has finished loading before using this hook."
    );
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
      // If the audio is set to loop, use the original element (for background music)
      // Otherwise clone it to allow simultaneous playback (for sound effects)
      if (audioElement.loop) {
        // Don't restart if already playing
        if (audioElement.paused) {
          try {
            await audioElement.play();
          } catch (error) {
            console.error("Failed to play sound:", error);
          }
        }
      } else {
        // Clone the audio element to allow simultaneous playback
        const clone = audioElement.cloneNode() as HTMLAudioElement;
        clone.volume = audioElement.volume;
        clone.playbackRate = audioElement.playbackRate;
        try {
          await clone.play();
        } catch (error) {
          console.error("Failed to play sound:", error);
        }
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

  const setLoop = useCallback(
    (loop: boolean) => {
      if (audioElement) {
        audioElement.loop = loop;
      }
    },
    [audioElement]
  );

  return useMemo(
    () => ({
      play,
      pause,
      stop,
      setVolume,
      setPlaybackRate,
      setLoop,
    }),
    [play, pause, stop, setVolume, setPlaybackRate, setLoop]
  );
}
