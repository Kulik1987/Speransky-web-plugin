import { createDarkTheme, createLightTheme } from "@fluentui/react-components";
import type { BrandVariants, Theme } from "@fluentui/react-components";

const themeColors: BrandVariants = {
  10: "#010404",
  20: "#0F1B1C",
  30: "#122D30",
  40: "#133A3F",
  50: "#12484E",
  60: "#0F565E",
  70: "#08656E",
  80: "#19737D",
  90: "#388089",
  100: "#508D95",
  110: "#669BA1",
  120: "#7CA8AE",
  130: "#91B6BA",
  140: "#A6C3C7",
  150: "#BAD1D4",
  160: "#CFDFE1",
};

export const lightTheme: Theme = createLightTheme(themeColors);
export const darkTheme: Theme = createDarkTheme(themeColors);
