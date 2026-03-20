import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useChecklistStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXL),
  },
  tabList: {
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  tab: {
    height: "auto",
    width: "48%",
    paddingTop: tokens.spacingVerticalSNudge,
    paddingBottom: tokens.spacingVerticalS,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.borderBottom("2px", "solid", tokens.colorNeutralStroke1),
    "&[aria-selected='true'], &[aria-selected='true']:hover": {
      backgroundColor: customColors.bg.accordion,
      ...shorthands.borderBottom("2px", "solid", tokens.colorBrandForegroundOnLightPressed),
    },
    "& .fui-Tab__content": {
      display: "flex",
      flexDirection: "column",
      fontWeight: tokens.fontWeightRegular,
    },
    "&::after, &::before": {
      display: "none",
    },
  },
  modeTitle: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorNeutralForeground1,
  },
  modeSubtitle: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: customColors.text.primary[65],
  },
  rulesHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: tokens.spacingVerticalS,
  },
  rulesLabel: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightRegular,
    paddingLeft: tokens.spacingHorizontalS,
  },
  rules: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  emptyBlock: {
    alignItems: "center",
  },
  emptyTitle: {
    color: customColors.text.primary[65],
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
    textAlign: "center",
  },
});
