import React from "react";
import { Text, Button } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { observer } from "mobx-react";
import { AuthStepperEnum } from "../../../store/auth";
import { useStepStyles } from "./styles";

const StepError = () => {
  const styles = useStepStyles();
  const { authStore } = useStores();

  const handleTryAgain = () => {
    authStore.setAuthStatus(AuthStepperEnum.EMAIL);
    authStore.resetStore();
  };

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Text as="h1" className={styles.title}>
          К сожалению, произошла ошибка...
        </Text>

        <Text block className={styles.error}>
          Ошибка авторизации.
          <br />
          Попробуйте еще раз.
        </Text>
      </div>

      <Button appearance="primary" onClick={handleTryAgain} className={styles.button}>
        Вход
      </Button>
    </div>
  );
};

export default observer(StepError);
