import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { customColors } from "../../../theme/theme";

export const useDrawerModalStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    ...shorthands.gap(tokens.spacingVerticalS),
    ...shorthands.padding(tokens.spacingVerticalL),
    paddingBottom: "8px",
  },
  header: {
    ...shorthands.padding(0),
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    ...shorthands.gap(tokens.spacingVerticalL),
    alignItems: "flex-start",
    ...shorthands.padding(0),
  },
  sections: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXL),
    color: customColors.text.primary[90],
  },
  sectionHeader: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  sectionContent: {
    "& > div": {
      display: "flex",
      alignItems: "center",
      ...shorthands.gap(tokens.spacingHorizontalSNudge),
      lineHeight: tokens.lineHeightHero700,
    },
  },
  sectionValue: {
    marginLeft: "70px",
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorBrandForeground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  sectionButton: {
    fontWeight: tokens.fontWeightRegular,
    color: customColors.text.primary[90],
    "&:disabled": {
      color: customColors.text.secondary,
    },
  },
  logoutButton: {
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorBrandForeground2,
    textAlign: "left",
    letterSpacing: "0.5px",
  },
  button: {
    height: "36px",
    width: "auto",
    ...shorthands.padding(0),
  },
  version: {
    display: "flex",
    justifyContent: "flex-end",
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase400,
    color: customColors.text.secondary,
    fontWeight: 350,
    ...shorthands.padding(0),
    paddingRight: tokens.spacingHorizontalS,
  },
});
