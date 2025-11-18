import { makeStyles, shorthands } from "@fluentui/react-components";

export const useSkeletonStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.borderRadius("8px"),
    ...shorthands.padding("16px"),
    ...shorthands.gap("12px"),
    ...shorthands.border("1px solid rgba(0, 0, 0, 0.1)"),
    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.25)",
  },
  skeletonBlock: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("16px"),
  },
  block: {
    display: "flex",
    justifyContent: "space-between",
    ...shorthands.gap("12px"),
  },
  item32: {
    maxWidth: "32px",
  },
  item64: {
    maxWidth: "64px",
  },
  item96: {
    maxWidth: "96px",
  },
});
