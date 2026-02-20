import { Tab, TabList, mergeClasses } from "@fluentui/react-components";
import type { SelectTabData, SelectTabEvent } from "@fluentui/react-components";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useStores } from "../../../store";
import { ReviewTypesEnums } from "../../../enums";
import { ReviewTypeGeneral } from "../reviewTypeGeneral";
import { ReviewTypeCustom } from "../reviewTypeCustom";
import { useReviewTypeStyles } from "./styles";
import { useLocation } from "react-router-dom";

const T = {
  titleGeneral: {
    ru: "Общая",
    en: "General",
  },
  titleCustom: {
    ru: "Индивидуальная",
    en: "Custom",
  },
};

const ReviewType = () => {
  const { menuStore } = useStores();
  const { locale } = menuStore;
  const styles = useReviewTypeStyles();
  const location = useLocation();

  const state = location.state as { tab?: ReviewTypesEnums } | null;
  const initialTab = state?.tab || ReviewTypesEnums.GENERAL;
  const [selectedValue, setSelectedValue] = useState<string>(initialTab);

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value as string);
  };

  return (
    <div className={styles.container}>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} appearance="subtle" className={styles.tablist}>
        <Tab value={ReviewTypesEnums.GENERAL} className={mergeClasses(styles.tab, styles.tabFirst)}>
          {T.titleGeneral[locale]}
        </Tab>
        <Tab value={ReviewTypesEnums.CUSTOM} className={mergeClasses(styles.tab, styles.tabLast)}>
          {T.titleCustom[locale]}
        </Tab>
      </TabList>

      {selectedValue === ReviewTypesEnums.GENERAL ? <ReviewTypeGeneral /> : <ReviewTypeCustom />}
    </div>
  );
};

export default observer(ReviewType);
