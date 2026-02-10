import { Tab, TabList, mergeClasses } from "@fluentui/react-components";
import type { SelectTabData, SelectTabEvent } from "@fluentui/react-components";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useStores } from "../../../store";
import { ReviewTypesEnums } from "../../../enums";
import { ReviewTypeGeneral } from "../reviewTypeGeneral";
import { ReviewTypeCustom } from "../reviewTypeCustom";
import { useReviewTypeStyles } from "./styles";

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

  const [selectedValue, setSelectedValue] = useState<string>(ReviewTypesEnums.GENERAL);

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
