import { makeStyles, shorthands } from "@fluentui/react-components";

export const useMainStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("28px"),
  },
});
