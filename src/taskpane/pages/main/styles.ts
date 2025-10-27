import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useMainStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("32px"),
    flexWrap: "wrap",
  },
  card: {
    ...shorthands.borderRadius("8px"),
    ...shorthands.padding("24px", "16px"),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("12px"),
    boxShadow: tokens.shadow16,
    ...shorthands.border(`1px solid ${tokens.colorNeutralStroke1}`),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  section: {
    ...shorthands.borderRadius("8px"),
    ...shorthands.padding("24px", "16px"),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("36px"),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  divider: {
    paddingBottom: "6px",
  },
  buttonFull: {
    width: "100%",
  },
});
