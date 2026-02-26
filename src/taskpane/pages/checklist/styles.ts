import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useChecklistStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
  },
});
