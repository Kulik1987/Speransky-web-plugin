import { makeStyles, tokens, shorthands } from "@fluentui/react-components";
import { customColors } from "./theme";

export const useCommonStyles = makeStyles({
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    ...shorthands.padding(tokens.spacingVerticalL),
    paddingBottom: "40px",
    position: "absolute",
    top: "48px",
    bottom: 0,
    left: 0,
    right: 0,
    ...shorthands.overflow("auto"),
    overflowY: "scroll",
    backgroundColor: "#FFFFFF",
  },
  outletContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    ...shorthands.gap(tokens.spacingVerticalXXXL),
  },
  input: {
    minWidth: "100%",
    borderBottomColor: tokens.colorNeutralStroke1,
    "&::after": { display: "none" },
    "&:focus-within": {
      borderBottomColor: tokens.colorBrandStroke2,
      borderBottomWidth: "2px",
    },
    "&:hover": {
      borderBottomColor: tokens.colorBrandStroke2,
    },
    "&:has(input:hover), &:has(input:active), &:has(input:focus-within)": {
      borderBottomColor: tokens.colorBrandStroke2,
    },
  },
  inputFill: {
    "&::after": { display: "none" },
    borderBottomColor: tokens.colorBrandForegroundOnLightPressed,
    borderBottomWidth: "2px",
    "&:focus-within": {
      borderBottomColor: tokens.colorBrandForegroundOnLightPressed,
      borderBottomWidth: "2px",
    },
  },
  dropdown: {
    borderBottomColor: tokens.colorNeutralStroke1,
    "&::after": { display: "none" },
    "&:focus-within": {
      borderBottomColor: tokens.colorBrandStroke2,
      borderBottomWidth: "2px",
    },
    "&:hover": {
      borderBottomColor: tokens.colorBrandStroke2,
    },
    "&:active": {
      borderBottomColor: tokens.colorBrandStroke2,
    },
  },
  button: {
    width: "100%",
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalMNudge,
    fontSize: tokens.fontSizeBase400,
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    whiteSpace: "pre-line",
    lineHeight: tokens.lineHeightBase400,
  },
  pageTitle: {
    ...shorthands.margin(0),
    color: customColors.text.primary[90],
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightSemibold,
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
      paddingRight: "40px",
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
  accordionActions: {
    position: "absolute",
    top: "12px",
    right: "8px",
    zIndex: 1,
  },
});
