import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useChecklistCardStyles = makeStyles({
  card: {
    boxSizing: "border-box",
    minHeight: "80px",
    display: "flex",
    ...shorthands.gap(tokens.spacingHorizontalM),
    ...shorthands.padding(tokens.spacingVerticalS),
    paddingBottom: tokens.spacingVerticalXL,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    boxShadow: "0px 0px 3px 0px #415B5D40, 0px 1px 2px 0px #415B5D26",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      ...shorthands.borderColor(tokens.colorBrandForeground2),
      boxShadow: "0px 0px 3px 0px #415B5D40, 0px 1px 2px 0px #415B5D26",
    },
  },
  cardSelected: {
    ...shorthands.borderColor(tokens.colorBrandForeground2),
  },
  radio: {
    pointerEvents: "none",
    ...shorthands.margin(0),
    ...shorthands.padding(0),
  },
  info: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXS),
    flexGrow: 1,
  },
  name: {
    lineHeight: tokens.lineHeightBase400,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  date: {
    color: customColors.text.primary[65],
    fontSize: tokens.fontSizeBase300,
  },
  menuTrigger: {
    maxHeight: "32px",
  },
});
