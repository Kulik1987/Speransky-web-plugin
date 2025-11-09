import React from "react";
import { Text, Button } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { observer } from "mobx-react";
import { AuthStepperEnum } from "../../../store/auth";
import { useStepStyles } from "./styles";

const T = {
  title: {
    ru: "К сожалению, произошла ошибка...",
    en: "Unfortunately, an error occurred...",
  },
  errorDescription: {
    ru: "Ошибка авторизации.\n Попробуйте ещё раз.",
    en: "Authorization error.\n Please try again.",
  },
  btnLogin: {
    ru: "Вход",
    en: "Sign in",
  },
};

const StepError = () => {
  const styles = useStepStyles();
  const { authStore, menuStore } = useStores();
  const { locale } = menuStore;

  const handleTryAgain = () => {
    authStore.setAuthStatus(AuthStepperEnum.EMAIL);
    authStore.resetStore();
  };

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Text as="h1" className={styles.title}>
          {T.title[locale]}
        </Text>

        <Text block className={styles.error}>
          {T.errorDescription[locale]}
        </Text>
      </div>

      <Button appearance="primary" onClick={handleTryAgain} className={styles.button}>
        {T.btnLogin[locale]}
      </Button>
    </div>
  );
};

export default observer(StepError);
