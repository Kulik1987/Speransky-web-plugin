import React, { useCallback, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Text } from "@fluentui/react-components";
import { useStores } from "../../../store";
import PinCode, { PinCodeRef } from "../../organisms/pinCode/PinCode";
import { useStepStyles } from "./styles";
import { ErrorText } from "../../atoms";
import { OtpErrorTagEnum } from "../../../store/auth";

const T = {
  title: {
    ru: "Вход",
    en: "Sign in",
  },
  description: {
    ru: "Используйте код из электронной почты",
    en: "Enter the code from the email",
  },
  errorPinCode: {
    ru: "Код введён неверно. Введите код заново.",
    en: "The code is incorrect. Please try again.",
  },
  errorNetwork: {
    ru: "Нет соединения с сервером. Проверьте интернет-соединение или отключите VPN.",
    en: "No connection to the server. Check your internet connection or disable VPN.",
  },
};

const StepPinCode = () => {
  const { authStore, menuStore } = useStores();
  const styles = useStepStyles();
  const { locale } = menuStore;

  const [errorPinCode, setErrorPinCode] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pinCodeRef = useRef<PinCodeRef>(null);

  const handleEnteredPinCode = useCallback(
    async (code: string) => {
      if (isLoading) return;
      try {
        setIsLoading(true);
        setErrorPinCode(false);
        setNetworkError(false);
        const response = await authStore.checkOtpCode(code);
        if (response?.status === "error") {
          if (response.errorType === OtpErrorTagEnum.NETWORK_ERROR) {
            setNetworkError(true);
          } else {
            setErrorPinCode(true);
            pinCodeRef.current?.clearPinCode();
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [authStore, isLoading]
  );

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

      <div className={styles.block}>
        <PinCode
          ref={pinCodeRef}
          onSuccess={handleEnteredPinCode}
          hasError={errorPinCode}
          errorMessage={T.errorPinCode[locale]}
        />
        {networkError && <ErrorText error={T.errorNetwork[locale]} />}
      </div>
    </div>
  );
};

export default observer(StepPinCode);
