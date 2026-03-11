import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useSkeletonStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
  },
  skeletonBlock: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXL),
    width: "100%",
  },
});
