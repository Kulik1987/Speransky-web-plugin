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
  riskTabList: {
    marginTop: "-8px",
    marginBottom: tokens.spacingVerticalS,
  },
  riskTab: {
    ...shorthands.padding(tokens.spacingVerticalSNudge),
    "&[aria-selected='true']": {
      fontWeight: tokens.fontWeightSemibold,
      color: "var(--risk-color)",
      "::after": {
        backgroundColor: "var(--risk-color)",
      },
      "& span": {
        color: "var(--risk-color)",
      },
    },
    "&[aria-selected='true']:hover": {
      color: "var(--risk-color)",
      "::after": {
        backgroundColor: "var(--risk-color)",
      },
      "& span": {
        color: "var(--risk-color)",
      },
    },
    "&[aria-selected='true']:active": {
      color: "var(--risk-color)",
      "::after": {
        backgroundColor: "var(--risk-color)",
      },
      "& span": {
        color: "var(--risk-color)",
      },
    },
  },
  riskTextarea: {
    "& span": {
      borderLeftWidth: "2px",
      borderLeftStyle: "solid",
      borderLeftColor: "var(--risk-color)",
      "&:hover, &:focus-within, &:active": {
        borderLeftWidth: "2px",
        borderLeftColor: "var(--risk-color)",
      },
    },
  },
});
