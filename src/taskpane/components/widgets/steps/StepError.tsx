import React from "react";
import { Text, Button, mergeClasses } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { observer } from "mobx-react";
import { AuthStepperEnum } from "../../../store/auth";
import { useStepStyles } from "./styles";
import { useCommonStyles } from "../../../theme/commonStyles";

const T = {
  title: {
    ru: "К сожалению, произошла ошибка...",
    en: "Unfortunately, an error occurred...",
  },
  error: {
    ru: "Ошибка авторизации.",
    en: "Authorization error.",
  },
  description: {
    ru: "Попробуйте ещё раз.",
    en: "Please try again.",
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
  const commonStyles = useCommonStyles();

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

        <div>
          <Text block className={mergeClasses(styles.description, commonStyles.error)}>
            {T.error[locale]}
          </Text>
          <Text block className={styles.description}>
            {T.description[locale]}
          </Text>
        </div>
      </div>

      <Button
        appearance="primary"
        onClick={handleTryAgain}
        className={mergeClasses(styles.button, commonStyles.button)}
      >
        {T.btnLogin[locale]}
      </Button>
    </div>
  );
};

export default observer(StepError);
