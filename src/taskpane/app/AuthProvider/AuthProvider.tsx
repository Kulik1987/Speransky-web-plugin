import React, { useEffect } from "react";
import { makeStyles, shorthands, Text } from "@fluentui/react-components";
import { AuthStepperEnum } from "../../store/auth";
import { useStores } from "../../store";
import { observer } from "mobx-react";
import { Outlet } from "react-router-dom";
import { StepEmail, StepForbidden, StepPinCode, StepError } from "../../components/widgets";
import { useAuthProviderStyles } from "./styles";

const AuthProvider = () => {
  const { authStore } = useStores();
  const { authStatus, isClientVerify, hasPluginAccess, isClientDataLoaded } = authStore;
  const styles = useAuthProviderStyles();

  if (isClientVerify && !isClientDataLoaded) {
    return (
      <div className={styles.container}>
        <Text>Загрузка...</Text>
      </div>
    );
  }

  if (isClientVerify && hasPluginAccess && authStatus === AuthStepperEnum.ACCESSED) {
    return <Outlet />;
  }

  return (
    <div className={styles.container}>
      {authStatus === AuthStepperEnum.EMAIL && <StepEmail />}
      {authStatus === AuthStepperEnum.PIN && <StepPinCode />}
      {authStatus === AuthStepperEnum.FORBIDDEN && <StepForbidden />}
      {authStatus === AuthStepperEnum.ERROR && <StepError />}
    </div>
  );
};

export default observer(AuthProvider);
