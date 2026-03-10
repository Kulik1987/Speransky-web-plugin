import React from "react";
import { mergeClasses } from "@fluentui/react-components";
import { ContractPartieData } from "../../../api/types";
import { usePartyFlagStyles } from "./styles";

const PartyFlag = ({ flag, parties }: { flag: string; parties: ContractPartieData[] }) => {
  const styles = usePartyFlagStyles();

  const getColorClass = () => {
    if (flag === "Все") return styles.partyAll;

    const index = parties.findIndex((p) => p.role === flag);
    if (index === 0) return styles.party0;
    if (index === 1) return styles.party1;

    return styles.party0;
  };

  return <div className={mergeClasses(styles.container, getColorClass())}>{flag}</div>;
};

export default PartyFlag;
