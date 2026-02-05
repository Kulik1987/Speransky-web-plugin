import React from "react";
import { Button, mergeClasses, Text } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStepStyles } from "./styles";
import { useStores } from "../../../store";
import { WebUrlEnums } from "../../../enums";
import { useCommonStyles } from "../../../theme/commonStyles";

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
  const { authStore, menuStore } = useStores();
  const { locale } = menuStore;
  const commonStyles = useCommonStyles();

  const handleBuyPlan = () => {
    const host = window.location.origin;
    const email = authStore.clientEmail || "";
    const params = `?from-plugin=true&email=${encodeURIComponent(email)}`;

    let baseUrl: string;

    if (host.includes("localhost")) {
      baseUrl = WebUrlEnums.WEB_URL_LOCAL;
    } else if (host.includes("plugin-test")) {
      baseUrl = WebUrlEnums.WEB_URL_TEST;
    } else {
      baseUrl = WebUrlEnums.WEB_URL_PROD;
    }

    const url = `${baseUrl}/${params}`;
    window.open(url, "_blank");
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

      <Button appearance="primary" onClick={handleBuyPlan} className={mergeClasses(styles.button, commonStyles.button)}>
        {T.btnCheck[locale]}
      </Button>
    </div>
  );
};

export default observer(StepForbidden);
