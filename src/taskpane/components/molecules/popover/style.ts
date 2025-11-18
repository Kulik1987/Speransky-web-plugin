import { makeStyles, shorthands } from "@fluentui/react-components";

export const usePopoverStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "220px",
    ...shorthands.borderRadius("8px"),
    ...shorthands.padding("16px"),
    ...shorthands.gap("16px"),
  },
  block: {
    display: "flex",
    justifyContent: "flex-end",
    ...shorthands.gap("8px"),
  },
  title: {
    whiteSpace: "pre-line",
  },
});
