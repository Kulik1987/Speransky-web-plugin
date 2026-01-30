import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useHeaderMenuStyles = makeStyles({
  container: {
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#19737D",
    height: "60px",
    ...shorthands.padding(tokens.spacingHorizontalL),
  },
});
