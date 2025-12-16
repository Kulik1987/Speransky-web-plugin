import React from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { Settings24Regular } from "@fluentui/react-icons";
import { Button, Field, Select, Textarea } from "@fluentui/react-components";
import { ReviewTypeItem } from "../../../components/organisms";
import { ReviewTypesEnums } from "../../../enums";

const ReviewTypeCustom = () => {
  const { suggestionsStore, menuStore } = useStores();
  const { locale } = menuStore;
  const navigate = useNavigate();
  const { parties, formCustomInstructions } = suggestionsStore;

  const isPartiesExist = Array.isArray(parties) && parties?.length > 0;

  const handleStartReviewCustom = async () => {
    await suggestionsStore.startReview(ReviewTypesEnums.CUSTOM);
    navigate("/summary");
  };

  const handleChangeParty = (_event: React.SyntheticEvent, item: any) => {
    suggestionsStore.setFormPartySelected(item.value);
  };

  const handleChangeCustomInstructions = (_event: React.SyntheticEvent, item: any) => {
    suggestionsStore.setFormCustomInstructions(item.value);
  };

  const T = {
    title: {
      ru: "Индивидуальная",
      en: "Custom",
    },
    subtitle: {
      ru: "Добавьте любые свои правила",
      en: "Focus the review on any topic",
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
    fieldCustomInstructionsLabel: {
      ru: "Пользовательские инструкции",
      en: "Custom instructions",
    },
    fieldCustomInstructionsPlaceholder: {
      ru: "Напишите конкретные требования или общие задачи проверки",
      en: "Enter a description of the condition",
    },
    buttonStart: {
      ru: "Начать проверку",
      en: "Start review",
    },
  };

  return (
    <ReviewTypeItem title={T.title[locale]} icon={<Settings24Regular color="grey" />} subtitle={T.subtitle[locale]}>
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
              return <option key={index}>{part}</option>;
            })}
        </Select>
      </div>
      <Field label={T.fieldCustomInstructionsLabel[locale]}>
        <Textarea
          placeholder={T.fieldCustomInstructionsPlaceholder[locale]}
          rows={5}
          onChange={handleChangeCustomInstructions}
          defaultValue={formCustomInstructions ?? ""}
        />
      </Field>
      <Button
        appearance="primary"
        size="medium"
        onClick={handleStartReviewCustom}
        style={{ borderColor: "#0f6cbd", borderWidth: "2px", whiteSpace: "nowrap" }}
        disabled={!isPartiesExist}
      >
        {T.buttonStart[locale]}
      </Button>
    </ReviewTypeItem>
  );
};

export default observer(ReviewTypeCustom);
