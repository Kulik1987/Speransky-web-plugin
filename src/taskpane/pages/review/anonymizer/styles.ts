import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useAnonymizerStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  button: {
    whiteSpace: "nowrap",
    alignSelf: "flex-start",
  },
});
