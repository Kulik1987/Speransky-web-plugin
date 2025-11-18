import { makeStyles, shorthands } from "@fluentui/react-components";

export const useHeaderMenuStyles = makeStyles({
  container: {
    display: "flex",
    ...shorthands.gap("8px"),
  },
  block: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
