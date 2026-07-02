import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  shirtConfig,
  type ColorKey,
  type DecalKey,
} from "../config/shirtConfig.ts";

type State = {
  intro: boolean;
  selectedColorId: ColorKey;
  selectedDecalId: DecalKey;
};

type Actions = {
  setIntro: (value: boolean) => void;
  selectColor: (id: ColorKey) => void;
  selectDecal: (id: DecalKey) => void;
  download: () => void;
};

export const useStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      intro: true,
      selectedColorId: "gold",
      selectedDecalId: "three2",

      setIntro: (value) => set({ intro: value }),
      selectColor: (id) => set({ selectedColorId: id }),
      selectDecal: (id) => set({ selectedDecalId: id }),

      download: () => {
        console.log("Downloading shirt with:", get());
      },
    }),
    { name: "Shirt Configurator" },
  ),
);

// Derived selectors
export const useSelectedColor = () => {
  const id = useStore((s) => s.selectedColorId);
  return shirtConfig.colors[id];
};

export const useSelectedDecal = () => {
  const id = useStore((s) => s.selectedDecalId);
  return shirtConfig.decals[id];
};

export const useTotalPrice = () => {
  const color = useSelectedColor();
  const decal = useSelectedDecal();
  return shirtConfig.basePrice + (color?.price ?? 0) + (decal?.price ?? 0);
};
