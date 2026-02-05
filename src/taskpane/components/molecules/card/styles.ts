import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useCardStyles = makeStyles({
  card: {
    ...shorthands.padding(tokens.spacingVerticalM),
    ...shorthands.gap(tokens.spacingVerticalM),
    cursor: "pointer",
    userSelect: "none",
  },
  title: {
    color: customColors.text.primary[100],
  },
  subtitle: {
    color: customColors.text.primary[65],
  },
  text: {
    color: customColors.text.primary[90],
    ...shorthands.margin(0),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    pointerEvents: "none",
  },
});
