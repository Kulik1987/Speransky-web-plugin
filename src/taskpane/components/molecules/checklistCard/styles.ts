import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useChecklistCardStyles = makeStyles({
  card: {
    boxSizing: "border-box",
    minHeight: "62px",
    display: "flex",
    ...shorthands.gap(tokens.spacingHorizontalS),
    ...shorthands.padding(tokens.spacingVerticalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border("1px", "solid", customColors.border[30]),
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      ...shorthands.borderColor(tokens.colorBrandForeground2),
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
    minWidth: 0,
  },
  name: {
    display: "block",
    lineHeight: tokens.lineHeightBase400,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: "nowrap",
    ...shorthands.overflow("hidden"),
    textOverflow: "ellipsis",
  },
  nameCopyPrefix: {
    color: customColors.accent.copy,
  },
  date: {
    color: customColors.text.primary[65],
    fontSize: tokens.fontSizeBase300,
  },
  menuTrigger: {
    maxHeight: "32px",
    color: tokens.colorBrandForeground2,
  },
});
