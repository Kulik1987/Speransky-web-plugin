import { makeStyles, shorthands } from "@fluentui/react-components";

export const useComboboxFieldStyles = makeStyles({
  dropdownList: {
    maxHeight: "260px",
    overflowY: "auto",
  },
  clearIcon: {
    ...shorthands.padding("4px"),
  },
});
