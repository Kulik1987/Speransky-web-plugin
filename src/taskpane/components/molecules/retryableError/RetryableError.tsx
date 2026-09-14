import React from "react";
import { Link } from "@fluentui/react-components";
import { ErrorText } from "../../atoms";
import { useRetryableErrorStyles } from "./styles";

type RetryableErrorProps = {
  error: string;
  retryText: string;
  onRetry: () => void;
};

const RetryableError = ({ error, retryText, onRetry }: RetryableErrorProps) => {
  const styles = useRetryableErrorStyles();

  return (
    <div className={styles.container}>
      <ErrorText error={error} />
      <Link onClick={onRetry}>{retryText}</Link>
    </div>
  );
};

export default RetryableError;
