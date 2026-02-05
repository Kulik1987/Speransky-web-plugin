import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useSummaryStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXXL),
  },
  block: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalL),
    marginBottom: tokens.spacingVerticalXXXL,
  },
});
