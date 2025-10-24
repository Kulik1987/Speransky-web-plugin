import React, { useRef, useState } from "react";
import { observer } from "mobx-react";
import { Text, makeStyles, shorthands } from "@fluentui/react-components";
import { useStores } from "../../../store";
import PinCode, { PinCodeRef } from "../../organisms/pinCode/PinCode";
import { useStepPinCodeStyles } from "./styles";

const StepPinCode = () => {
  const { authStore } = useStores();
  const styles = useStepPinCodeStyles();

  const [errorPinCode, setErrorPinCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pinCodeRef = useRef<PinCodeRef>(null);

  const handleEnteredPinCode = async (code: string) => {
    try {
      if (isLoading) return;
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
  };

  return (
    <div className={styles.container}>
      <Text as="h1" weight="bold" size={400}>
        Войти
      </Text>

      <Text size={300}>Используйте код из электронной почты</Text>

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
