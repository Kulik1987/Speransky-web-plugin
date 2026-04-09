import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useMainStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
});
