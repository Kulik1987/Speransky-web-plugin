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
  emptyBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingVerticalL),
    ...shorthands.padding(0, tokens.spacingHorizontalS),
  },
  emptyTitle: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    alignSelf: "flex-start",
  },
});
