import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useCardStyles = makeStyles({
  card: {
    ...shorthands.padding(tokens.spacingVerticalM),
    ...shorthands.gap(tokens.spacingVerticalM),
    cursor: "pointer",
    userSelect: "none",
    boxShadow: "0px 0px 3px 0px #415B5D40, 0px 1px 2px 0px #415B5D26",
    "&:hover": {
      boxShadow: "0px 0px 3px 0px #415B5D40, 0px 1px 2px 0px #415B5D26",
    },
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
