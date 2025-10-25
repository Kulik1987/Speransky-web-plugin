import React, { useState } from "react";
import { observer } from "mobx-react";
import { Button, Input, InputProps, Text, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { useStepEmailStyles } from "./styles";

const StepEmail = () => {
  const { authStore } = useStores();
  const styles = useStepEmailStyles();

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
      setError("Введите корректный email");
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
      <Text as="h1" weight="bold" size={400} className={styles.title}>
        Войти
      </Text>

      <Text size={300} className={styles.description}>
        Используйте адрес электронной почты для авторизации
      </Text>

      <Input
        className={styles.input}
        value={email}
        onChange={handleEmailChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="example@email.com"
        type="email"
        disabled={isLoading}
        autoFocus
        appearance="outline"
        size="large"
      />

      <Button onClick={handleSubmit} disabled={isDisabled} appearance="primary" size="large">
        {isLoading ? "Отправка..." : "Получить код"}
      </Button>

      {isDisplayErrorMessage && (
        <Text size={400} className={styles.error}>
          {error}
        </Text>
      )}

      <Text size={200} className={styles.description}>
        На указанный адрес электронной почты будет отправлен код
      </Text>
    </div>
  );
};

export default observer(StepEmail);
