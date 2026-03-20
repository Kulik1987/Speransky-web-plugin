import React from "react";
import { mergeClasses } from "@fluentui/react-components";
import { LevelOfCriticalEnum } from "../../../enums";
import { useFlagStyles } from "./styles";

const PriorityFlag = ({ flag }: { flag: LevelOfCriticalEnum }) => {
  const styles = useFlagStyles();
  const label = flag.charAt(0).toUpperCase() + flag.slice(1);

  return <div className={mergeClasses(styles.container, styles[flag])}>{label}</div>;
};

export default PriorityFlag;
