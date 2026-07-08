import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import {
  shirtConfig,
  type ColorKey,
  type DecalKey,
  type OptionValue,
} from "../config/shirtConfig.ts";

type Item = {
  color: OptionValue;
  decal: OptionValue;
  price: number;
};

type State = {
  intro: boolean;
  selectedColorId: ColorKey;
  selectedDecalId: DecalKey;
  cart: Item[];

  downloadHandler: (() => void) | null;
};

type Actions = {
  setIntro: (value: boolean) => void;
  selectColor: (id: ColorKey) => void;
  selectDecal: (id: DecalKey) => void;
  registerDownload: (fn: (() => void) | null) => void;
  download: () => void;
  hydrateFromURL: () => void;
  syncURL: () => void;
  addToCart: () => void;
};

const useStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      intro: true,
      selectedColorId: "gold",
      selectedDecalId: "three2",

      cart: [],

      downloadHandler: null,

      setIntro: (value) => set({ intro: value }, false, "setIntro"),
      selectColor: (id) => {
        set({ selectedColorId: id }, false, "selectColor");
        get().syncURL();
      },
      selectDecal: (id) => {
        set({ selectedDecalId: id }, false, "selectDecal");
        get().syncURL();
      },

      addToCart: () => {
        const { cart, selectedColorId, selectedDecalId } = get();
        const color = shirtConfig.colors[selectedColorId];
        const decal = shirtConfig.decals[selectedDecalId];
        const price = shirtConfig.basePrice + color.price + decal.price;
        set({ cart: [...cart, { color, decal, price }] }, false, "addToCart");
      },

      registerDownload: (fn) =>
        set({ downloadHandler: fn }, false, "registerDownload"),

      download: () => {
        get().downloadHandler?.();
      },

      hydrateFromURL: () => {
        const params = new URLSearchParams(window.location.search);
        const color = params.get("color");
        const decal = params.get("decal");

        set(
          {
            ...(color &&
              color in shirtConfig.colors && {
                selectedColorId: color as ColorKey,
              }),
            ...(decal &&
              decal in shirtConfig.decals && {
                selectedDecalId: decal as DecalKey,
              }),
          },
          false,
          "hydrateFromURL",
        );
      },
      syncURL: () => {
        const { selectedColorId, selectedDecalId } = get();
        const params = new URLSearchParams({
          color: selectedColorId,
          decal: selectedDecalId,
        });
        history.replaceState(null, "", `?${params}`);
      },
    }),
    { name: "Shirt Configurator" },
  ),
);

// State hooks (atomic)
export const useIntro = () => useStore((s) => s.intro);

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
  return shirtConfig.basePrice + color.price + decal.price;
};

export const useCart = () => useStore((s) => s.cart);

// Actions hook
export const useShirtActions = () =>
  useStore(
    useShallow((s) => ({
      setIntro: s.setIntro,
      selectColor: s.selectColor,
      selectDecal: s.selectDecal,
      registerDownload: s.registerDownload,
      download: s.download,
      addToCart: s.addToCart,
    })),
  );

// Transient Getter (read only)
export const getShirtState = useStore.getState;
