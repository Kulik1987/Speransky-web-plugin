import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useChecklistRuleStyles = makeStyles({
  container: {
    position: "relative",
  },
  accordionItem: {
    position: "relative",
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
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
    "& textarea": {
      ...shorthands.overflow("hidden"),
      minHeight: "76px",
      backgroundColor: customColors.bg.textarea,
    },
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
