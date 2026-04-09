import React from "react";
import { Text } from "@fluentui/react-components";
import { useCommonStyles } from "../../../theme/commonStyles";

const ErrorText = ({ error }: { error: string }) => {
  const commonStyles = useCommonStyles();

  return (
    <Text block size={300} align="center" className={commonStyles.error}>
      {error}
    </Text>
  );
};

export default ErrorText;
