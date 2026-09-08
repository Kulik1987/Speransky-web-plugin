import { makeStyles, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useHighlightedTextStyles = makeStyles({
  text: {
    whiteSpace: "pre-wrap",
  },
  highlighted: {
    color: customColors.accent.copy,
    fontWeight: tokens.fontWeightSemibold,
  },
});
