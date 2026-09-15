import React from "react";
import { Button, Link } from "@fluentui/react-components";
import { ErrorText } from "../../atoms";
import { useRetryableErrorStyles } from "./styles";

type RetryableErrorProps = {
  error: string;
  retryText: string;
  onRetry: () => void;
  variant?: "link" | "button";
};

const RetryableError = ({ error, retryText, onRetry, variant = "link" }: RetryableErrorProps) => {
  const styles = useRetryableErrorStyles();

  return (
    <div className={styles.container}>
      <ErrorText error={error} />
      {variant === "button" ? (
        <Button appearance="primary" onClick={onRetry}>
          {retryText}
        </Button>
      ) : (
        <Link onClick={onRetry}>{retryText}</Link>
      )}
    </div>
  );
};

export default RetryableError;
