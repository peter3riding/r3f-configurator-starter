import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface StoreState {
  intro: boolean;

  colors: string[];
  decals: string[];

  selectedColor: string;
  selectedDecal: string;

  setIntro: (value: boolean) => void;
  setSelectedColor: (color: string) => void;
  setSelectedDecal: (decal: string) => void;
}

export default create<StoreState>()(
  subscribeWithSelector((set) => ({
    intro: true,

    colors: [
      "#ccc",
      "#EFBD4E",
      "#80C670",
      "#726DE8",
      "#EF674E",
      "#353934",
      "#800080",
    ],

    decals: ["react", "three2", "pmndrs"],

    selectedColor: "#EFBD4E",
    selectedDecal: "three2",

    setIntro: (value) => set({ intro: value }),

    setSelectedColor: (color) =>
      set({
        selectedColor: color,
      }),

    setSelectedDecal: (decal) =>
      set({
        selectedDecal: decal,
      }),
  })),
);
