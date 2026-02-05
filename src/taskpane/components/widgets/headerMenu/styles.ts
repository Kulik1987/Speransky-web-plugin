import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useHeaderMenuStyles = makeStyles({
  container: {
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: tokens.colorBrandBackground,
    height: "60px",
    ...shorthands.padding(tokens.spacingHorizontalL),
  },
});
