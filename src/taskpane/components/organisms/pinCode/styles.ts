import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const usePinCodeStyles = makeStyles({
  codeField: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "68px",
  },
  codeRow: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    ...shorthands.gap("8px"),
  },
  codeWrapper: {
    borderBottomWidth: "4px",
    borderBottomStyle: "solid",
    borderBottomColor: customColors.border[10],
  },
  codeWrapperActive: {
    borderBottomColor: tokens.colorBrandForeground2,
  },
  codeWrapperError: {
    borderBottomColor: customColors.accent.delete,
  },
  validationMessage: {
    marginTop: tokens.spacingVerticalM,
  },
  codeInput: {
    width: "70px",
    height: "38px",
    fontSize: tokens.fontSizeHero700,
    lineHeight: tokens.lineHeightHero700,
    fontWeight: tokens.fontWeightMedium,
    letterSpacing: "0.5px",
    "& input": {
      textAlign: "center",
    },
    ...shorthands.border("none"),
    "&::after": {
      display: "none",
    },
  },
});
