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
});
