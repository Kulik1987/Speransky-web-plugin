import React, { useCallback, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Text } from "@fluentui/react-components";
import { useStores } from "../../../store";
import PinCode, { PinCodeRef } from "../../organisms/pinCode/PinCode";
import { useStepStyles } from "./styles";

const StepPinCode = () => {
  const { authStore } = useStores();
  const styles = useStepStyles();

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
        } else {
          console.log("OTP успешно подтверждён");
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
          Вход
        </Text>

        <Text block className={styles.description}>
          Используйте код из электронной почты
        </Text>
      </div>

      <PinCode ref={pinCodeRef} onSuccess={handleEnteredPinCode} />

      {errorPinCode && (
        <Text size={300} className={styles.error}>
          Код введён неверно. Введите код заново.
        </Text>
      )}
    </div>
  );
};

export default observer(StepPinCode);
