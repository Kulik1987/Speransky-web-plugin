import React from "react";
import { Button, Text } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStepStyles } from "./styles";

const StepForbidden = () => {
  const styles = useStepStyles();

  const handleBuyPlan = () => {
    window.open("https://app.speransky.legal", "_blank");
  };

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Text as="h1" className={styles.title}>
          Доступ к плагину закрыт.
        </Text>

        <Text block className={styles.description}>
          Ваша подписка неактивна. Чтобы продолжить пользоваться возможностями плагина, продлите подписку.
        </Text>
      </div>

      <Button appearance="primary" onClick={handleBuyPlan} className={styles.button}>
        Проверить подписку
      </Button>
    </div>
  );
};

export default observer(StepForbidden);
