import { makeStyles, tokens } from "@fluentui/react-components";

export const useSelectionLangStyles = makeStyles({
  btnSection: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: tokens.spacingVerticalXXL,
  },
  btn: {
    minWidth: "50px",
    maxWidth: "50px",
  },
});
