import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useReviewTypeGeneralStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalXXL),
  },
  expandableList: {
    display: "flex",
    flexDirection: "column",
  },
  expandableHeader: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingVerticalSNudge),
    ...shorthands.padding(tokens.spacingVerticalM),
    ...shorthands.border("1px", "solid", tokens.colorBrandForeground2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  expandableHeaderText: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorBrandForeground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  expandableContent: {
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    overflowY: "hidden",
    boxShadow: "0px 0px 3px 0px #08656E66, 0px 1px 2px 0px #08656E66",
  },
  expandableItem: {
    ...shorthands.padding(tokens.spacingVerticalSNudge, 0),
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1,
  },
});
