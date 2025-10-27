import React, { useState } from "react";
import { observer } from "mobx-react";
import { Button, Input, InputProps, Text } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { useStepStyles } from "./styles";

const T = {
  title: {
    ru: "Вход",
    en: "Sign in",
  },
  description: {
    ru: "На указанный адрес электронной почты будет отправлен код",
    en: "A code will be sent to the specified email address",
  },
  btnSubmit: {
    ru: "Получить код",
    en: "Get code",
  },
  btnSubmiting: {
    ru: "Отправка...",
    en: "Sending...",
  },
  errorEmpty: {
    ru: "Введите email",
    en: "Enter your email",
  },
  errorFormat: {
    ru: "Неверный формат email",
    en: "Invalid email format",
  },
  errorNotFound: {
    ru: "Не существует клиента с указанным email. Проверьте правильность ввода.",
    en: "No client found with this email. Please check your input.",
  },
};

const StepEmail = () => {
  const { authStore, menuStore } = useStores();
  const styles = useStepStyles();
  const { locale } = menuStore;

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
      setError(T.errorEmpty[locale]);
      return;
    }
    if (!validateEmail(email)) {
      setError(T.errorFormat[locale]);
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
        setError(T.errorNotFound[locale]);
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
          {T.title[locale]}
        </Text>

        <Text block className={styles.description}>
          {T.description[locale]}
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
          // autoFocus
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
        {isLoading ? T.btnSubmiting[locale] : T.btnSubmit[locale]}
      </Button>
    </div>
  );
};

export default observer(StepEmail);
