export type OptionValue = {
  id: string;
  label: string;
  price: number;
  hex?: string;
};

export const colors = {
  grey: { id: "grey", label: "Grey", price: 0, hex: "#ccc" },
  gold: { id: "gold", label: "Gold", price: 0, hex: "#EFBD4E" },
  green: { id: "green", label: "Green", price: 0, hex: "#80C670" },
  purple: { id: "purple", label: "Purple", price: 5, hex: "#726DE8" },
  orange: { id: "orange", label: "Orange", price: 5, hex: "#EF674E" },
  darkgreen: { id: "darkgreen", label: "Dark Green", price: 5, hex: "#353934" },
  deeppurple: {
    id: "deeppurple",
    label: "Deep Purple",
    price: 5,
    hex: "#800080",
  },
} as const satisfies Record<string, OptionValue>;

export const decals = {
  react: { id: "react", label: "React", price: 10 },
  three2: { id: "three2", label: "Three.js", price: 12 },
  pmndrs: { id: "pmndrs", label: "PMNDRS", price: 8 },
} as const satisfies Record<string, OptionValue>;

export const shirtConfig = {
  basePrice: 25,
  colors,
  decals,
} as const;

// Helper types
export type ColorKey = keyof typeof colors;
export type DecalKey = keyof typeof decals;
