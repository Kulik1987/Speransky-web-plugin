import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useReviewStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  block: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("28px"),
  },
  title: {
    marginTop: tokens.spacingVerticalS,
  },
});
