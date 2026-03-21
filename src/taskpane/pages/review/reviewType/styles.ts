import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useReviewTypeStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
  tablist: {
    width: "100%",
    height: "40px",
    display: "flex",
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
  tab: {
    width: "50%",
    cursor: "pointer",
    ...shorthands.border("1px", "solid", customColors.border[30]),
    "& span": {
      fontSize: tokens.fontSizeBase400,
      lineHeight: tokens.lineHeightBase400,
      fontWeight: tokens.fontWeightRegular,
    },
    "&::before, &::after": {
      display: "none",
    },
    "&:hover, &:active": {
      backgroundColor: "#FFFFFF",
    },
    "&[aria-selected='true'], &[aria-selected='true']:hover, &[aria-selected='true']:active": {
      backgroundColor: tokens.colorBrandForeground2,
      ...shorthands.borderColor(tokens.colorBrandForeground2),
    },
    "&[aria-selected='true'] span, &[aria-selected='true']:hover span, &[aria-selected='true']:active span": {
      color: "#FFFFFF",
    },
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalL),
    position: "relative",
  },
  radioItem: {
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
    ...shorthands.border("1px", "solid", customColors.border[20]),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingHorizontalS),
    "&:hover": {
      ...shorthands.borderColor(tokens.colorBrandForeground2),
    },
    "&:has(input:checked)": {
      ...shorthands.borderColor(tokens.colorBrandForeground2),
    },
    "& input:enabled:not(:checked) ~ .fui-Radio__label": {
      color: tokens.colorNeutralForeground1,
    },
  },
  radioItemLabel: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.padding(0, tokens.spacingHorizontalXS),
    cursor: "pointer",
  },
});
