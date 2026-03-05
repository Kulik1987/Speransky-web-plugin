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
  },
  tab: {
    width: "50%",
    ...shorthands.borderRadius(0),
    ...shorthands.borderStyle("solid"),
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderColor(customColors.border[20]),
    "& span": {
      fontSize: tokens.fontSizeBase400,
      lineHeight: tokens.lineHeightBase400,
      fontWeight: tokens.fontWeightRegular,
    },
    "&[aria-selected='true']::after, &:hover::before": {
      left: "-1px",
      right: 0,
      bottom: "-1px",
      width: "101%",
      borderTopLeftRadius: tokens.borderRadiusMedium,
      borderTopRightRadius: tokens.borderRadiusMedium,
      ...shorthands.borderColor(tokens.colorBrandForeground2),
    },
    "&:hover::before": {
      backgroundColor: customColors.border[20],
    },
    "&[aria-selected='true']": {
      backgroundColor: tokens.colorBrandForeground2,
      "& span": {
        color: "#FFFFFF",
      },
    },
    "&[aria-selected='true']:hover": {
      backgroundColor: tokens.colorBrandForeground1,
      "& span": {
        color: "#FFFFFF",
      },
    },
  },
  tabFirst: {
    borderTopLeftRadius: tokens.borderRadiusMedium,
    borderBottomLeftRadius: tokens.borderRadiusMedium,
    borderRightWidth: 0,
  },
  tabLast: {
    borderTopRightRadius: tokens.borderRadiusMedium,
    borderBottomRightRadius: tokens.borderRadiusMedium,
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalL),
    position: "relative",
  },
  radioItem: {
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
    cursor: "pointer",
  },
});
