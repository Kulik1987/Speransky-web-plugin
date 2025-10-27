import { makeStyles, shorthands } from "@fluentui/react-components";

export const usePinCodeStyles = makeStyles({
  codeRow: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    ...shorthands.gap("8px"),
  },
  input: {
    width: "50px",
    height: "50px",
    textAlign: "center",
    fontSize: "32px",
    fontWeight: 600,
  },
});
