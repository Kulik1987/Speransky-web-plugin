import React from "react";
import { observer } from "mobx-react";
import { useStores } from "../../store";
import { useChecklistStyles } from "./styles";
import { Button } from "@fluentui/react-components";

const T = {};

const Checklist = () => {
  const { menuStore } = useStores();
  const { locale } = menuStore;
  const styles = useChecklistStyles();

  return (
    <div className={styles.container}>
      <div>Title</div>
      <Button>Add new</Button>
    </div>
  );
};

export default observer(Checklist);
