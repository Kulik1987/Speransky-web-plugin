import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useChecklistStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  tabList: {
    ...shorthands.gap(tokens.spacingHorizontalM),
    marginBottom: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalS,
  },
  tab: {
    height: "auto",
    width: "48%",
    paddingTop: 0,
    paddingBottom: tokens.spacingVerticalS,
    "& .fui-Tab__content": {
      display: "flex",
      flexDirection: "column",
      fontWeight: tokens.fontWeightRegular,
    },
    "&[aria-selected='true']::after, &:hover::before": {
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
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
});
