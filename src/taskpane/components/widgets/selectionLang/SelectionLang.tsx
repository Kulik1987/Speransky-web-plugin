import React from "react";
import { ToggleButton } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { LocaleEnums } from "../../../store/menu";
import { useSelectionLangStyles } from "./styles";
import { useCommonStyles } from "../../../theme/commonStyles";

const T = {
  dividerLang: {
    ru: "Язык интерфейса",
    en: "Interface language",
  },
};

const SelectionLang = () => {
  const { menuStore } = useStores();
  const { locale, setLocale } = menuStore;
  const commonStyles = useCommonStyles();
  const styles = useSelectionLangStyles();

  const isRU = locale === LocaleEnums.RU;
  const isEN = locale === LocaleEnums.EN;

  return (
    <div className={styles.btnSection}>
      <ToggleButton
        className={commonStyles.button}
        appearance={isRU ? "primary" : undefined}
        size="medium"
        checked={isRU}
        onClick={() => setLocale(LocaleEnums.RU)}
      >
        RU
      </ToggleButton>
      <ToggleButton
        className={commonStyles.button}
        appearance={isEN ? "primary" : "secondary"}
        size="medium"
        checked={isEN}
        onClick={() => setLocale(LocaleEnums.EN)}
      >
        EN
      </ToggleButton>
    </div>
  );
};

export default observer(SelectionLang);
