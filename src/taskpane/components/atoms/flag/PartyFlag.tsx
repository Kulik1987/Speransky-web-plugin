import React from "react";
import { mergeClasses } from "@fluentui/react-components";
import { useFlagStyles } from "./styles";

const PartyFlag = ({ flag }: { flag: string }) => {
  const styles = useFlagStyles();
  const label = flag === "Все" ? "Все стороны" : flag;

  return <div className={mergeClasses(styles.container, styles.party)}>{label}</div>;
};

export default PartyFlag;
