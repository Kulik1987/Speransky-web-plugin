import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const usePinCodeStyles = makeStyles({
  codeRow: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    ...shorthands.gap("8px"),
    marginTop: "68px",
  },
  codeWrapper: {
    borderBottomWidth: "4px",
    borderBottomStyle: "solid",
    borderBottomColor: customColors.border,
  },
  codeWrapperActive: {
    borderBottomColor: tokens.colorBrandForeground2,
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
    "&::after": {
      display: "none",
    },
  },
});
