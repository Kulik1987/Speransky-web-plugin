import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStepStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    ...shorthands.gap("32px"),
    width: "100%",
  },
  block: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ...shorthands.gap("12px"),
  },
  title: {
    fontSize: "24px",
    lineHeight: "130%",
    fontWeight: 600,
    ...shorthands.margin(0),
    textAlign: "center",
  },
  description: {
    color: tokens.colorNeutralForeground3,
    textAlign: "center",
    fontSize: "16px",
    lineHeight: "130%",
    maxWidth: "380px",
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: "16px",
    lineHeight: "130%",
    whiteSpace: "pre-line",
    textAlign: "center",
  },
  headerBlock: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ...shorthands.gap("12px"),
  },
  input: {
    width: "100%",
    maxWidth: "380px",
    height: "52px",
  },
  button: {
    width: "100%",
    maxWidth: "380px",
    height: "52px",
    fontSize: "18px",
  },
});
