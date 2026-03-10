import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const usePartyFlagStyles = makeStyles({
  container: {
    ...shorthands.borderRadius("10px"),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    userSelect: "none",
    color: "#FFFFFF",
    fontSize: tokens.fontSizeBase200,
  },
  partyAll: {
    backgroundColor: customColors.text.primary[100],
  },
  party0: {
    backgroundColor: customColors.text.primary[90],
  },
  party1: {
    backgroundColor: customColors.text.primary[65],
  },
});
