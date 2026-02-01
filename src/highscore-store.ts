import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Highscore = {
  name: string;
  points: number;
};

type HighscoreState = {
  highscores: Highscore[];

  addHighscore: (entry: Highscore) => void;
  clearHighscores: () => void;
};

export const useHighscores = create<HighscoreState>()(
  persist(
    (set) => ({
      highscores: [],

      addHighscore: (entry) =>
        set((state) => ({
          highscores: [...state.highscores, entry]
            .sort((a, b) => b.points - a.points)
            .slice(0, 10), // keep top 10
        })),

      clearHighscores: () => set({ highscores: [] }),
    }),
    {
      name: "highscores-storage", // localStorage key
    }
  )
);
