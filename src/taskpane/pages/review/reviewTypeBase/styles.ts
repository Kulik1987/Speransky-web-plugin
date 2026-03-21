import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useReviewTypeBaseStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
  accordionHeader: {
    "& > button": {
      color: customColors.text.primary[90],
      fontWeight: tokens.fontWeightSemibold,
    },
  },
  accordionPanel: {
    ...shorthands.gap(tokens.spacingVerticalL),
  },
});
