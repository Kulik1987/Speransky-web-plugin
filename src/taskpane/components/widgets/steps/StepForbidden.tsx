import React from "react";
import { Button, Text } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStepStyles } from "./styles";
import { useStores } from "../../../store";

const T = {
  title: {
    ru: "Доступ к плагину закрыт.",
    en: "Access to the plugin is restricted.",
  },
  description: {
    ru: "Ваша подписка неактивна. Чтобы продолжить пользоваться возможностями плагина, продлите подписку.",
    en: "Your subscription is inactive. To continue using the plugin features, please renew your subscription.",
  },
  btnCheck: {
    ru: "Проверить подписку",
    en: "Check subscription",
  },
};

const StepForbidden = () => {
  const styles = useStepStyles();
  const { menuStore } = useStores();
  const { locale } = menuStore;

  const handleBuyPlan = () => {
    window.open("https://app.speransky.legal", "_blank");
  };

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Text as="h1" className={styles.title}>
          {T.title[locale]}
        </Text>

        <Text block className={styles.description}>
          {T.description[locale]}
        </Text>
      </div>

      <Button appearance="primary" onClick={handleBuyPlan} className={styles.button}>
        {T.btnCheck[locale]}
      </Button>
    </div>
  );
};

export default observer(StepForbidden);
