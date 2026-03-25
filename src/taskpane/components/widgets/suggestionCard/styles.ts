import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useSuggestionCardStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalL),
    backgroundColor: customColors.bg.textarea,
    ...shorthands.border("solid", "1px", customColors.border[30]),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalS),
    paddingBottom: tokens.spacingVerticalXXL,
  },
  flagBlock: {
    display: "flex",
    ...shorthands.gap(tokens.spacingHorizontalMNudge),
  },
  changesBlock: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
    lineHeight: "18px",
  },
  addText: {
    display: "block",
    lineHeight: "18px",
    color: customColors.accent.risk.low.text,
    fontWeight: tokens.fontWeightSemibold,
  },
  deleteText: {
    display: "block",
    lineHeight: "18px",
    ...shorthands.textDecoration("line-through"),
    color: customColors.accent.removeText,
  },
  buttonsBlock: {
    display: "flex",
    justifyContent: "space-between",
  },
  changeButtons: {
    display: "flex",
    ...shorthands.gap(tokens.spacingHorizontalMNudge),
  },
  commentLink: {
    color: tokens.colorBrandForeground1,
    textDecorationLine: "underline",
    cursor: "pointer",
  },
});
