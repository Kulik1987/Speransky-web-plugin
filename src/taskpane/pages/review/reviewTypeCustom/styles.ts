import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useReviewTypeCustomStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
  textarea: {
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalSNudge),
    "&:placeholder": {
      color: customColors.text.primary[65],
      fontSize: tokens.fontSizeBase300,
    },
  },
});
