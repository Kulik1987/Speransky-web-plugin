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
  },
  btnAdd: {
    alignSelf: "flex-end",
    ...shorthands.padding(tokens.spacingVerticalSNudge, tokens.spacingHorizontalM),
    marginBottom: tokens.spacingVerticalS,
  },
  accordion: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
  accordionItem: {
    position: "relative",
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  accordionHeader: {
    "& > button": {
      backgroundColor: customColors.bg.accordion[75],
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: tokens.colorNeutralStroke1,
      paddingTop: tokens.spacingVerticalM,
      paddingBottom: tokens.spacingVerticalM,
      paddingLeft: tokens.spacingHorizontalS,
      paddingRight: tokens.spacingHorizontalXL,
      minHeight: "48px",
      fontSize: tokens.fontSizeBase400,
      lineHeight: tokens.lineHeightBase400,
      fontWeight: tokens.fontWeightSemibold,
      color: customColors.text.primary[90],
    },
  },
  accordionPanel: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
    ...shorthands.margin(tokens.spacingHorizontalM, tokens.spacingVerticalS),
  },
  btnSaveChecklist: {
    position: "absolute",
    top: "12px",
    right: "8px",
    zIndex: 1,
  },
  dropdownList: {
    maxHeight: "260px",
    overflowY: "auto",
  },
});
