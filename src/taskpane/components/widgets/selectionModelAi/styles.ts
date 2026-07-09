import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useSelectionModelAiStyles = makeStyles({
  container: {
    display: "flex",
    ...shorthands.gap("16px"),
    flexDirection: "column",
  },
  toggleBtnBlock: {
    display: "flex",
    justifyContent: "center",
    ...shorthands.gap("16px"),
    flexWrap: "wrap",
  },
});
