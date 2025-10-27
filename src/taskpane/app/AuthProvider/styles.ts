import { makeStyles, shorthands } from "@fluentui/react-components";

export const useAuthProviderStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("16px"),
    ...shorthands.padding("16px"),
  },
});
