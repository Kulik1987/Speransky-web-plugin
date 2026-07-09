import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useDraftStyles = makeStyles({
  container: {
    display: "flex",
    ...shorthands.gap("16px"),
    flexDirection: "column",
  },
});
