import { makeStyles, shorthands } from "@fluentui/react-components";

export const useReviewStyles = makeStyles({
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
});
