import { createDarkTheme, createLightTheme } from "@fluentui/react-components";
import type { BrandVariants, Theme } from "@fluentui/react-components";

export const customColors = {
  text: {
    primary: {
      100: "#001232",
      90: "#001232E5",
      65: "#001232A6",
    },
    secondary: "#898989",
  },
  border: {
    10: "#5E5E5E",
    20: "#CCD0D6",
    30: "#E4E8ED",
    40: "#465A6E1A",
  },
  bg: {
    accordion: "#E4E8EDB2",
    textarea: "#F0F0F059",
    header: "#E1E4EA",
    partyflag: "#032C4512",
  },
  accent: {
    delete: "#C50F1F",
    removeText: "#EC6100",
    copy: "#0F6CBD",
    rule: {
      standard: "#F6D2B5",
      advanced: "#B9EBA5",
    },
    risk: {
      low: {
        bg: "#DFF2D7",
        text: "#089408",
      },
      medium: {
        bg: "#F9B7804D",
        text: "#FF790F",
      },
      high: {
        bg: "#F8C9C6",
        text: "#8A2A27",
      },
    },
  },
} as const;

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

export const lightTheme: Theme = {
  ...createLightTheme(themeColors),
  colorStrokeFocus2: "transparent",
};

export const darkTheme: Theme = createDarkTheme(themeColors);
