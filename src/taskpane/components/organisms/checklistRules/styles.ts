import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useChecklistRuleStyles = makeStyles({
  container: {
    position: "relative",
  },
  accordionHeader: {
    "& > button": {
      backgroundColor: customColors.bg.accordion[35],
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: tokens.colorNeutralStroke1,
      ...shorthands.padding(tokens.spacingHorizontalM, tokens.spacingVerticalS),
      minHeight: "40px",
      fontSize: tokens.fontSizeBase400,
      lineHeight: tokens.lineHeightBase400,
    },
  },
  accordionPanel: {
    ...shorthands.margin(tokens.spacingHorizontalS, tokens.spacingVerticalM),
  },
  fields: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalS),
    "& label": {
      fontWeight: tokens.fontWeightSemibold,
      lineHeight: tokens.lineHeightBase400,
      marginBottom: tokens.spacingVerticalS,
      color: customColors.text.primary[90],
    },
    "& span": {
      borderBottomColor: tokens.colorNeutralStroke1,
      paddingBottom: 0,
      "&::after": {
        display: "none",
      },
      "&:hover, &:focus-within, &:active": {
        borderBottomColor: tokens.colorNeutralStroke1,
        "&::after": {
          display: "none",
        },
      },
    },
    "& textarea": {
      ...shorthands.overflow("auto"),
      minHeight: "56px",
      paddingTop: tokens.spacingVerticalXS,
      paddingBottom: tokens.spacingVerticalXXXL,
      paddingLeft: tokens.spacingHorizontalSNudge,
      paddingRight: tokens.spacingHorizontalSNudge,
      backgroundColor: customColors.bg.textarea,
    },
  },
  labelOptional: {
    color: customColors.text.secondary,
  },
  btnDelete: {
    alignSelf: "flex-end",
  },
  riskSection: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXS),
  },
  riskBtnBlock: {
    display: "flex",
    flexDirection: "row",
    ...shorthands.gap(tokens.spacingHorizontalS),
    marginBottom: tokens.spacingVerticalS,
  },
  btnRisk: {
    maxHeight: "24px",
    ...shorthands.flex(1),
    minWidth: 0,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
  },
  btnRiskHover: {
    ":hover": {
      ...shorthands.borderColor("var(--risk-color)"),
      backgroundColor: "transparent",
      color: "var(--risk-color)",
    },
  },
  btnRiskSelected: {
    backgroundColor: "var(--risk-color)",
    ...shorthands.borderColor("var(--risk-color)"),
    color: "#ffffff",
    ":hover": {
      backgroundColor: "var(--risk-color)",
      color: "#ffffff",
    },
  },
});
