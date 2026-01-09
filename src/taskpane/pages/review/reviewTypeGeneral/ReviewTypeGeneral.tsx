import React from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { Fire24Regular } from "@fluentui/react-icons";
import { Button, Select } from "@fluentui/react-components";
import { ReviewTypeItem } from "../../../components/organisms";
import { useStores } from "../../../store";

const ReviewTypeGeneral = () => {
  const { suggestionsStore, menuStore } = useStores();
  const { locale } = menuStore;
  const navigate = useNavigate();
  const { parties } = suggestionsStore;

  const isPartiesExist = Array.isArray(parties) && parties?.length > 0;

  const handleStartAnalysis = async () => navigate("/summary");

  const handleChangeParty = (_event: React.SyntheticEvent, item: any) => {
    suggestionsStore.setFormPartySelected(item.value);
  };

  const T = {
    title: {
      ru: "Общая",
      en: "General",
    },
    subtitle: {
      ru: "Анализ на базовые риски и спорные пункты",
      en: "Scan for obvious risks snd issues",
    },
    selectVerifyLabel: {
      ru: "Выберите, что отображать",
      en: "Select the type verification",
    },
    selectVerifyItem1: {
      ru: "Примечания и правки",
      en: "Comments and Readlines",
    },
    selectVerifyItem2: {
      ru: "Примечания",
      en: "Comments Only",
    },
    selectVerifyItem3: {
      ru: "Правки",
      en: "Redlines Only",
    },
    selectPartyLabel: {
      ru: "Выберите сторону договора",
      en: "Select a party",
    },
    buttonStart: {
      ru: "Начать проверку",
      en: "Start review",
    },
  };

  return (
    <ReviewTypeItem title={T.title[locale]} icon={<Fire24Regular />} subtitle={T.subtitle[locale]}>
      <div>
        <label htmlFor="selectVerification">{T.selectVerifyLabel[locale]}</label>
        <Select id="selectVerification" disabled>
          <option>{T.selectVerifyItem1[locale]}</option>
          <option>{T.selectVerifyItem2[locale]}</option>
          <option>{T.selectVerifyItem3[locale]}</option>
        </Select>
      </div>
      <div>
        <label htmlFor="selectParty">{T.selectPartyLabel[locale]}</label>
        <Select id="selectParty" disabled={!isPartiesExist} onChange={handleChangeParty}>
          {isPartiesExist &&
            parties.map((part, index) => {
              return <option key={index}>{part.role}</option>;
            })}
        </Select>
      </div>
      <Button
        appearance="primary"
        size="medium"
        onClick={handleStartAnalysis}
        style={{ borderColor: "#0f6cbd", borderWidth: "2px", whiteSpace: "nowrap" }}
        disabled={!isPartiesExist}
      >
        {T.buttonStart[locale]}
      </Button>
    </ReviewTypeItem>
  );
};

export default observer(ReviewTypeGeneral);
