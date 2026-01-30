import React, { useCallback, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Text } from "@fluentui/react-components";
import { useStores } from "../../../store";
import PinCode, { PinCodeRef } from "../../organisms/pinCode/PinCode";
import { useStepStyles } from "./styles";
import { ErrorText } from "../../atoms";

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
};

const StepPinCode = () => {
  const { authStore, menuStore } = useStores();
  const styles = useStepStyles();
  const { locale } = menuStore;

  const [errorPinCode, setErrorPinCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pinCodeRef = useRef<PinCodeRef>(null);

  const handleEnteredPinCode = useCallback(
    async (code: string) => {
      if (isLoading) return;
      try {
        setIsLoading(true);
        const response = await authStore.checkOtpCode(code);
        if (response?.status === "error") {
          setErrorPinCode(true);
          pinCodeRef.current?.clearPinCode();
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

      <PinCode ref={pinCodeRef} onSuccess={handleEnteredPinCode} />

      {errorPinCode && <ErrorText error={T.errorPinCode[locale]} />}
    </div>
  );
};

export default observer(StepPinCode);
