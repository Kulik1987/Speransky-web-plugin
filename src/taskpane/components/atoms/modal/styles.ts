import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useModalStyles = makeStyles({
  container: {
    maxWidth: "300px",
    ...shorthands.padding(tokens.spacingVerticalXXXL),
    "@media screen and (max-width: 480px)": {
      maxWidth: "300px",
    },
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: customColors.text.primary[90],
  },
  actionsBlock: {
    "@media screen and (max-width: 480px)": {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  },
});
