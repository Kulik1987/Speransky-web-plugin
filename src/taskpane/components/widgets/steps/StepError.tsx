import React from "react";
import { Text, makeStyles, shorthands, Button } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { observer } from "mobx-react";
import { AuthStepperEnum } from "../../../store/auth";
import { useStepErrorStyles } from "./styles";

const StepError = () => {
  const styles = useStepErrorStyles();
  const { authStore } = useStores();

  const handleTryAgain = () => {
    authStore.setAuthStatus(AuthStepperEnum.EMAIL);
    authStore.resetStore();
  };

  return (
    <div className={styles.container}>
      <Text as="h1" weight="bold" size={400}>
        Произошла ошибка
      </Text>
      <Text size={300} className={styles.errorText}>
        К сожалению, произошла ошибка при авторизации или проверке доступа. Пожалуйста, попробуйте еще раз.
      </Text>
      <Button appearance="primary" onClick={handleTryAgain}>
        Войти
      </Button>
    </div>
  );
};

export default observer(StepError);
