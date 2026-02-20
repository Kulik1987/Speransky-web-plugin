import React from "react";
import { useLocation } from "react-router-dom";
import { mergeClasses, ToggleButton } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { AuthStepperEnum } from "../../../store/auth";
import { LocaleEnums } from "../../../store/menu";
import { useSelectionLangStyles } from "./styles";
import { useCommonStyles } from "../../../theme/commonStyles";
import { RoutePathEnum } from "../../../enums";

const SelectionLang = () => {
  const { menuStore, authStore } = useStores();
  const { locale, setLocale } = menuStore;
  const { pathname } = useLocation();
  const commonStyles = useCommonStyles();
  const styles = useSelectionLangStyles();

  const isVisible =
    authStore.authStatus === AuthStepperEnum.EMAIL ||
    (pathname === RoutePathEnum.ROOT && authStore.authStatus === AuthStepperEnum.ACCESSED);

  if (!isVisible) return null;

  const isRU = locale === LocaleEnums.RU;

  const toggleLocale = () => {
    setLocale(isRU ? LocaleEnums.EN : LocaleEnums.RU);
  };

  return (
    <div className={styles.btnSection}>
      <ToggleButton
        className={mergeClasses(commonStyles.button, styles.btn)}
        appearance="primary"
        size="medium"
        onClick={toggleLocale}
      >
        {isRU ? "Ru" : "En"}
      </ToggleButton>
    </div>
  );
};

export default observer(SelectionLang);
