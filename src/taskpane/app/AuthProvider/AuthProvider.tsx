import React from "react";
import { AuthStepperEnum } from "../../store/auth";
import { useStores } from "../../store";
import { observer } from "mobx-react";
import { Outlet } from "react-router-dom";
import { StepEmail, StepForbidden, StepPinCode, StepError } from "../../components/widgets";

const AuthProvider = () => {
  const { authStore } = useStores();
  const { authStatus, isClientVerify } = authStore;

  if (isClientVerify && authStatus === AuthStepperEnum.ACCESSED) {
    return <Outlet />;
  }

  return (
    <div>
      {authStatus === AuthStepperEnum.EMAIL && <StepEmail />}
      {authStatus === AuthStepperEnum.PIN && <StepPinCode />}
      {authStatus === AuthStepperEnum.FORBIDDEN && <StepForbidden />}
      {authStatus === AuthStepperEnum.ERROR && <StepError />}
    </div>
  );
};

export default observer(AuthProvider);
