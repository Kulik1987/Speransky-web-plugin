import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useRetryableErrorStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingVerticalS),
  },
});
