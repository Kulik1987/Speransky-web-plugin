import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../theme/theme";

export const useChecklistStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  blockTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "26px",
  },
  btnTitle: {
    width: "auto",
    alignSelf: "center",
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: customColors.text.primary[90],
    ...shorthands.padding(0),
    ":hover": {
      backgroundColor: "transparent",
    },
  },
  btnAdd: {
    ...shorthands.padding(tokens.spacingVerticalSNudge, tokens.spacingHorizontalM),
  },
  dropdownList: {
    maxHeight: "260px",
    overflowY: "auto",
  },
  accordionHeader: {
    "& > button": {
      color: customColors.text.primary[90],
      fontWeight: tokens.fontWeightSemibold,
    },
  },
  accordionHeaderTitle: {
    display: "block",
    flexGrow: 1,
    minWidth: 0,
    whiteSpace: "nowrap",
    ...shorthands.overflow("hidden"),
    textOverflow: "ellipsis",
  },
  clearIcon: {
    ...shorthands.padding("4px"),
    cursor: "pointer",
  },
  noMatchesText: {
    color: customColors.text.primary[65],
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
    textAlign: "center",
  },
});
