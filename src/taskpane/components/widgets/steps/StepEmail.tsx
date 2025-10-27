import React, { useState } from "react";
import { observer } from "mobx-react";
import { Button, Input, InputProps, Text } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { useStepStyles } from "./styles";

const StepEmail = () => {
  const { authStore } = useStores();
  const styles = useStepStyles();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange: InputProps["onChange"] = (_, data) => {
    setError("");
    if (data.value.length <= 50) {
      setEmail(data.value.trim());
    }
  };

  const handleBlur = (_: React.FocusEvent<HTMLInputElement>) => {
    if (!email) {
      setError("Введите email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Неверный формат email");
      return;
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegexp.test(email);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");
      await authStore.runSignIn(email);
    } catch (error) {
      if (error?.type === "NOT_FOUND") {
        setError("Не существует клиента с указанным email. Проверьте правильность ввода.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isDisabled) {
      handleSubmit();
    }
  };

  const isDisabled = !email || !validateEmail(email) || isLoading;
  const isDisplayErrorMessage = !!error;

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Text as="h1" className={styles.title}>
          Вход
        </Text>

        <Text block className={styles.description}>
          На указанный адрес электронной почты будет отправлен код
        </Text>
      </div>

      <div className={styles.block}>
        <Input
          className={styles.input}
          value={email}
          onChange={handleEmailChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="example@gmail.com"
          type="email"
          disabled={isLoading}
          autoFocus
          appearance="outline"
          size="large"
        />

        {isDisplayErrorMessage && (
          <Text block className={styles.error}>
            {error}
          </Text>
        )}
      </div>

      <Button appearance="primary" onClick={handleSubmit} disabled={isDisabled} className={styles.button}>
        {isLoading ? "Отправка..." : "Получить код"}
      </Button>
    </div>
  );
};

export default observer(StepEmail);
