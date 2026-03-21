import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useHeaderMenuStyles = makeStyles({
  container: {
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: customColors.bg.header,
    height: "48px",
    ...shorthands.padding(tokens.spacingHorizontalL),
  },
  logoHidden: {
    visibility: "hidden",
  },
  logoVisible: {
    visibility: "visible",
  },
});
