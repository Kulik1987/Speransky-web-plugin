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
    },
    "&[aria-selected='true']::after, &:hover::before": {
      left: "-1px",
      right: 0,
      bottom: "-1px",
      width: "101%",
      borderTopLeftRadius: tokens.borderRadiusMedium,
      borderTopRightRadius: tokens.borderRadiusMedium,
    },
    "&:hover::before": {
      backgroundColor: customColors.border[20],
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
});
