import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useHeaderMenuStyles = makeStyles({
  container: {
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: tokens.colorBrandBackground,
    height: "48px",
    ...shorthands.padding(tokens.spacingHorizontalL),
    backgroundImage: "linear-gradient(90deg, #19737D 0%, #08656E 50%, #0F565E 100%)",
  },
  logoHidden: {
    visibility: "hidden",
  },
  logoVisible: {
    visibility: "visible",
  },
});
