import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useReviewTypeBaseStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
  accordionHeader: {
    "& > button": {
      backgroundColor: `color-mix(in srgb, ${tokens.colorBrandBackground2} 75%, transparent)`,
      ...shorthands.padding(tokens.spacingHorizontalM, tokens.spacingVerticalS),
    },
  },
  accordionPanel: {
    ...shorthands.gap(tokens.spacingVerticalL),
  },
});
