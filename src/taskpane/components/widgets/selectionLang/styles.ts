import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useSelectionLangStyles = makeStyles({
  btnSection: {
    display: "flex",
    ...shorthands.gap(tokens.spacingHorizontalM),
    marginBottom: "44px",
    marginLeft: "16px",
    marginRight: "16px",
  },
});
