import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useCommonStyles = makeStyles({
  card: {
    ...shorthands.padding(tokens.spacingVerticalL),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow4,
  },
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    ...shorthands.gap(tokens.spacingVerticalXXXL),
    ...shorthands.padding(tokens.spacingVerticalL),
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    ...shorthands.overflow("auto"),
    overflowY: "scroll",
    backgroundColor: "#FFFFFF",
  },
  outletContainer: {
    ...shorthands.flex(1),
  },
  input: {
    minWidth: "100%",
  },
  button: {
    minWidth: "100%",
    paddingTop: "8px",
    paddingBottom: "10px",
    fontSize: "16px",
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
  },
});
