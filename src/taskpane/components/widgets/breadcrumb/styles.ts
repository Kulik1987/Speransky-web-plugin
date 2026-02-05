import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useBreadcrumbStyles = makeStyles({
  divider: {
    color: customColors.text.primary[65],
    ...shorthands.padding(tokens.spacingVerticalXS),
  },
  button: {
    lineHeight: tokens.lineHeightBase600,
    ...shorthands.padding(0),
    "&:hover": {
      color: customColors.text.primary[90],
    },
  },
  default: {
    color: customColors.text.primary[65],
  },
  active: {
    color: customColors.text.primary[90],
  },
});
