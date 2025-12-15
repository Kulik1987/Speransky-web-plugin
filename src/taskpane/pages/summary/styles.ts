import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useSummaryStyles = makeStyles({
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
  button: {
    ...shorthands.borderColor("#0f6cbd"),
    ...shorthands.borderWidth("2px"),
    whiteSpace: "nowrap",
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: "16px",
    lineHeight: "130%",
    whiteSpace: "pre-line",
    textAlign: "center",
  },
});
