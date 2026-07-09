import React from "react";
import { observer } from "mobx-react";
import { useDraftStyles } from "./styles";

const Draft = () => {
  const styles = useDraftStyles();

  return <div className={styles.container}>Draft</div>;
};

export default observer(Draft);
