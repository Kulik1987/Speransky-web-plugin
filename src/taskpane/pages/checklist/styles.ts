import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../theme/theme";

export const useChecklistStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  btnTitle: {
    width: "auto",
    alignSelf: "flex-start",
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: customColors.text.primary[90],
    ...shorthands.padding(0),
    ":hover": {
      backgroundColor: "transparent",
    },
  },
  btnAdd: {
    alignSelf: "flex-end",
    ...shorthands.padding(tokens.spacingVerticalSNudge, tokens.spacingHorizontalM),
    marginBottom: tokens.spacingVerticalS,
  },
  dropdownList: {
    maxHeight: "260px",
    overflowY: "auto",
  },
});
