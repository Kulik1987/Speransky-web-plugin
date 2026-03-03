import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

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
      backgroundColor: `color-mix(in srgb, ${tokens.colorBrandBackground2} 75%, transparent)`,
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: tokens.colorNeutralStroke1,
      ...shorthands.padding(tokens.spacingHorizontalM, tokens.spacingVerticalS),
      minHeight: "48px",
      fontSize: tokens.fontSizeBase400,
      lineHeight: tokens.lineHeightBase400,
      fontWeight: tokens.fontWeightSemibold,
    },
  },
  accordionPanel: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
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
