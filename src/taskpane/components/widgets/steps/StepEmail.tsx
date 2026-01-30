import React, { useState } from "react";
import { observer } from "mobx-react";
import { Button, Input, InputProps, Link, Text } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { useStepStyles } from "./styles";
import { useCommonStyles } from "../../../theme/commonStyles";
import { CheckBox, ErrorText } from "../../atoms";

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
  errorMaxLength: {
    ru: "Электронная почта не может превышать 100 символов",
    en: "Email cannot exceed 100 characters",
  },
  errorFormat: {
    ru: "Неверный формат email",
    en: "Invalid email format",
  },
  errorNotFound: {
    ru: "Не существует клиента с указанным email. Проверьте правильность ввода.",
    en: "No client found with this email. Please check your input.",
  },
  agreementText1: {
    ru: "Я согласен(-а) с ",
    en: "I agree with ",
  },
  agreementText2: {
    ru: "Политикой конфиденциальности",
    en: "the Privacy Policy",
  },
};

const StepEmail = () => {
  const { authStore, menuStore } = useStores();
  const commonStyles = useCommonStyles();
  const styles = useStepStyles();
  const { locale } = menuStore;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleEmailChange: InputProps["onChange"] = (_, data) => {
    const value = data.value;
    setEmail(value);

    if (value.length > 100) {
      setError(T.errorMaxLength[locale]);
      return;
    }
    setError("");
  };

  const handleBlur = (_: React.FocusEvent<HTMLInputElement>) => {
    if (!email) {
      return;
    }
    if (!validateEmail(email)) {
      setError(T.errorFormat[locale]);
      return;
    }
    if (email.length > 100) {
      setError(T.errorMaxLength[locale]);
      return;
    }
    setError("");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegexp =
      /^(?!.*\.\.)(?!\.)(?!.*\.$)([a-zA-Z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_{|}~-]+)*)@([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+)$/;
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
    if (e.key === " ") {
      e.preventDefault();
    }
    if (e.key === "Enter" && isEmailValid) {
      handleSubmit();
    }
  };

  const isDisplayErrorMessage = !!error;
  const isEmailValid = email && validateEmail(email) && email.length <= 100;

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Text as="h1" className={styles.title}>
          {T.title[locale]}
        </Text>

        <Text block className={styles.description}>
          {T.description[locale]}
        </Text>

        <Input
          className={commonStyles.input}
          value={email}
          onChange={handleEmailChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="example@gmail.com"
          type="email"
          disabled={isLoading}
          autoFocus
          appearance="outline"
          size="medium"
        />

        {isDisplayErrorMessage && <ErrorText error={error} />}
      </div>

      <Button
        appearance="primary"
        size="medium"
        onClick={handleSubmit}
        disabled={!isEmailValid || isLoading || !isChecked}
        className={commonStyles.button}
      >
        {isLoading ? T.btnSubmiting[locale] : T.btnSubmit[locale]}
      </Button>

      <CheckBox
        label={
          <Text>
            {T.agreementText1[locale]}
            <Link href="https://speransky.legal/privacy_policy" target="_blank" inline>
              {T.agreementText2[locale]}
            </Link>
          </Text>
        }
        disabled={isChecked && isLoading}
        checked={isChecked}
        onChange={setIsChecked}
      />
    </div>
  );
};

export default observer(StepEmail);
