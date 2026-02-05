import { makeStyles, shorthands } from "@fluentui/react-components";

export const useCheckBoxStyles = makeStyles({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    ...shorthands.gap("10px"),
    "@media(max-width: 428px)": {
      alignItems: "flex-start",
    },
  },
  checkbox: {
    ...shorthands.margin(0),
    "& .fui-Checkbox__indicator": {
      marginTop: "0",
      marginBottom: "0",
      marginLeft: "0",
      marginRight: "0",
    },
  },
  label: {
    cursor: "pointer",
    userSelect: "none",
    textAlign: "left",
    "@media(max-width: 428px)": {
      marginTop: "-4px",
    },
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
});
