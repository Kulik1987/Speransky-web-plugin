import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../theme/theme";

export const useReviewStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  block: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("28px"),
  },
  title: {
    ...shorthands.margin(0),
    color: customColors.text.primary[90],
    lineHeight: tokens.lineHeightBase400,
  },
  error: {
    lineHeight: tokens.lineHeightBase400,
    whiteSpace: "pre-line",
    textAlign: "center",
  },
});
