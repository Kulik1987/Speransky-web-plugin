import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useSummaryStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
  block: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  tooltip: {
    maxWidth: "270px",
    backgroundColor: tokens.colorBrandForegroundOnLightPressed,
    color: "#FFFFFF",
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius("5px"),
  },
});
