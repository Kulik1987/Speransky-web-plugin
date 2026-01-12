import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useReviewStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("32px"),
  },
  block: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("16px"),
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: "16px",
    lineHeight: "130%",
    whiteSpace: "pre-line",
    textAlign: "center",
  },
});
