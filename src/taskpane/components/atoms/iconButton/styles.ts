import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useIconButtonStyles = makeStyles({
  tooltip: {
    backgroundColor: tokens.colorBrandForegroundOnLightPressed,
    color: "#FFFFFF",
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius("5px"),
  },
});
