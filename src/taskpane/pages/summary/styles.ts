import { makeStyles, shorthands } from "@fluentui/react-components";

export const useSummaryStyles = makeStyles({
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
  button: {
    ...shorthands.borderColor("#0f6cbd"),
    ...shorthands.borderWidth("2px"),
    whiteSpace: "nowrap",
  },
});
