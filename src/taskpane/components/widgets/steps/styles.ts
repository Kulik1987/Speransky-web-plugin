import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStepStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    ...shorthands.gap(tokens.spacingVerticalXXXL),
    width: "100%",
  },
  block: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  title: {
    fontSize: "22px",
    lineHeight: tokens.lineHeightBase500,
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.margin(0),
    textAlign: "center",
    letterSpacing: "2%",
  },
  description: {
    textAlign: "center",
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    "&:not(:first-of-type)": {
      marginTop: "4px",
    },
  },
  button: {
    marginTop: "28px",
  },
});
