import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useModalStyles = makeStyles({
  container: {
    maxWidth: "388px",
    ...shorthands.padding(tokens.spacingVerticalXXL),
    "@media screen and (max-width: 480px)": {
      maxWidth: "260px",
    },
  },
  body: {
    display: "flex",
    flexDirection: "column",
    color: customColors.text.primary[90],
  },
  bodyGapSmall: {
    ...shorthands.gap("10px"),
  },
  bodyGapLarge: {
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
  withContent: {
    maxWidth: "388px",
    "@media screen and (max-width: 480px)": {
      maxWidth: "340px",
    },
  },
  actionsBlock: {
    display: "flex",
    justifyContent: "flex-end",
    "@media screen and (max-width: 480px)": {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    "& button": {
      minWidth: "auto",
    },
  },
  btnCancel: {
    color: tokens.colorBrandForeground2,
    "&:hover": {
      color: tokens.colorBrandForeground2,
    },
  },
});
