import React from "react";
import { Button, Text, makeStyles, shorthands } from "@fluentui/react-components";
import { Mail24Regular, Cart24Regular } from "@fluentui/react-icons";
import { observer } from "mobx-react";
import { useStepForbiddenStyles } from "./styles";

const StepForbidden = () => {
  const styles = useStepForbiddenStyles();

  const handleBuyPlan = () => {
    window.open("https://app.speransky.legal/tariffs", "_blank");
  };

  const handleContactSupport = () => {
    window.open("mailto:info@speransky.legal");
  };

  return (
    <div className={styles.container}>
      <Text as="h1" size={500} className={styles.title}>
        Доступ к плагину закрыт.
      </Text>

      <Text size={300} className={styles.description}>
        Ваша подписка не активна или срок действия тарифа закончился. Чтобы продолжить пользоваться возможностями
        плагина, обновите подписку или свяжитесь с нашей поддержкой.
      </Text>

      <div className={styles.buttons}>
        <Button icon={<Cart24Regular />} appearance="primary" size="large" onClick={handleBuyPlan}>
          Оформить новый тариф
        </Button>

        <Button icon={<Mail24Regular />} appearance="secondary" size="large" onClick={handleContactSupport}>
          Связаться с поддержкой
        </Button>
      </div>
    </div>
  );
};

export default observer(StepForbidden);
