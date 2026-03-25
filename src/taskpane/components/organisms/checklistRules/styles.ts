import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useChecklistRuleStyles = makeStyles({
  container: {
    position: "relative",
  },
  accordionHeader: {
    position: "relative",
    "& > button": {
      paddingLeft: tokens.spacingHorizontalL,
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
      marginBottom: tokens.spacingVerticalXS,
      color: customColors.text.primary[90],
      "& > span[aria-hidden]": {
        color: tokens.colorBrandForeground2,
      },
    },
    "& span": {
      ...shorthands.borderColor(customColors.border[30]),
      paddingBottom: 0,
      "&::after": {
        display: "none",
      },
      "&:hover, &:focus-within, &:active": {
        ...shorthands.borderColor(customColors.border[30]),
        "&::after": {
          display: "none",
        },
      },
    },
    "& textarea": {
      ...shorthands.overflow("auto"),
      minHeight: "64px",
      lineHeight: "18px",
      paddingTop: tokens.spacingVerticalXS,
      paddingBottom: tokens.spacingVerticalL,
      paddingLeft: tokens.spacingHorizontalSNudge,
      paddingRight: tokens.spacingHorizontalSNudge,
      backgroundColor: customColors.bg.textarea,
      "&::placeholder": {
        color: customColors.text.primary[65],
      },
    },
  },
  labelOptional: {
    color: customColors.text.secondary,
    fontWeight: tokens.fontWeightRegular,
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
    ":hover, :active": {
      ...shorthands.borderColor("var(--risk-color-bg)"),
      backgroundColor: "transparent",
      color: "var(--risk-color-text)",
    },
  },
  btnRiskSelected: {
    backgroundColor: "var(--risk-color-bg)",
    ...shorthands.borderColor("var(--risk-color-bg)"),
    color: "var(--risk-color-text)",
    ":hover": {
      backgroundColor: "var(--risk-color-bg)",
      color: "var(--risk-color-text)",
    },
  },
  ruleFlag: {
    position: "absolute",
    top: "8px",
    right: "8px",
    ...shorthands.borderRadius("16px"),
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase100,
    ...shorthands.padding("5px", "9px"),
  },
  simple: {
    backgroundColor: customColors.accent.rule.standard,
  },
  advanced: {
    backgroundColor: customColors.accent.rule.advanced,
  },
});
