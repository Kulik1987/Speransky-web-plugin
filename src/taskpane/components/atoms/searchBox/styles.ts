import { makeStyles } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useSearchBoxStyles = makeStyles({
  searchbox: {
    "& input::placeholder": {
      color: customColors.border[30],
    },
    "& svg": {
      color: customColors.border[30],
    },
  },
});
