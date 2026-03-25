import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { LevelOfCriticalEnum } from "../../../enums";
import { customColors } from "../../../theme/theme";

export const useFlagStyles = makeStyles({
  container: {
    ...shorthands.borderRadius("16px"),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    userSelect: "none",
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
  [LevelOfCriticalEnum.HIGH]: {
    backgroundColor: customColors.accent.risk.high.bg,
    color: customColors.accent.risk.high.text,
    ...shorthands.border("1px", "solid", customColors.accent.risk.high.text),
  },
  [LevelOfCriticalEnum.MEDIUM]: {
    backgroundColor: customColors.accent.risk.medium.bg,
    color: customColors.accent.risk.medium.text,
    ...shorthands.border("1px", "solid", customColors.accent.risk.medium.text),
  },
  [LevelOfCriticalEnum.LOW]: {
    backgroundColor: customColors.accent.risk.low.bg,
    color: customColors.accent.risk.low.text,
    ...shorthands.border("1px", "solid", customColors.accent.risk.low.text),
  },
  party: {
    backgroundColor: customColors.bg.partyflag,
    color: tokens.colorNeutralForeground1,
    ...shorthands.border("1px", "solid", customColors.border[40]),
  },
});
