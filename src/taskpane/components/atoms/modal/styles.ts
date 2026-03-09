import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useModalStyles = makeStyles({
  container: {
    maxWidth: "300px",
    ...shorthands.padding(tokens.spacingVerticalXXXL),
    "@media screen and (max-width: 480px)": {
      maxWidth: "300px",
    },
  },
  body: {
    display: "flex",
    flexDirection: "column",
  },
  bodyGapSmall: {
    ...shorthands.gap("10px"),
  },
  bodyGapLarge: {
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
  withContent: {
    maxWidth: "388px",
    "@media screen and (max-width: 480px)": {
      maxWidth: "388px",
    },
  },
  actionsBlock: {
    display: "flex",
    justifyContent: "space-between",
    "@media screen and (max-width: 480px)": {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  },
  btnCancel: {
    color: tokens.colorBrandForeground2,
    "&:hover": {
      color: tokens.colorBrandForeground2,
    },
  },
});
