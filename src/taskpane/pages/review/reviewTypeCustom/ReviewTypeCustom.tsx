import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { Button, Dropdown, Field, Option, Textarea } from "@fluentui/react-components";
import { useReviewTypeCustomStyles } from "./styles";
import { PartyDropdown } from "../../../components/molecules";

const T = {
  contractTypeLabel: {
    ru: "Тип договора",
    en: "Contract type",
  },
  contractTypeOptions: {
    ru: [
      "Договор оказания услуг",
      "Договор подряда",
      "Договор поставок",
      "Договор купли-продажи недвижимости",
      "Договор аренды недвижимости",
      "Договор купли-продажи доли в ООО",
      "Лицензионный договор",
      "Соглашение о конфиденциальности (NDA)",
    ],
    en: [
      "Services Agreement",
      "Works Contract",
      "Supply Agreement",
      "Real Estate Purchase and Sale Agreement",
      "Real Estate Lease Agreement",
      "Agreement for the Sale and Purchase of a Share in an LLC",
      "License Agreement",
      "Non-Disclosure Agreement (NDA)",
    ],
  },
  selectPartyLabel: {
    ru: "Сторона договора",
    en: "Party to the contract",
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

const ReviewTypeCustom = () => {
  const { suggestionsStore, menuStore } = useStores();
  const { locale } = menuStore;
  const navigate = useNavigate();
  const { parties, formCustomInstructions } = suggestionsStore;
  const styles = useReviewTypeCustomStyles();

  const isPartiesExist = Array.isArray(parties) && parties?.length > 0;
  const [isPartySelected, setIsPartySelected] = useState(false);

  const handleStartAnalysis = async () => navigate("/summary");

  const handleChangeContractType = () => {};
  const handleChangeCustomInstructions = (_event: React.SyntheticEvent, item: any) => {
    suggestionsStore.setFormCustomInstructions(item.value);
  };

  return (
    <div className={styles.container}>
      <Dropdown
        id="selectContractType"
        placeholder={T.contractTypeLabel[locale]}
        disabled={!isPartiesExist}
        onOptionSelect={handleChangeContractType}
        size="large"
      >
        {T.contractTypeOptions[locale].map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Dropdown>

      <PartyDropdown placeholder={T.selectPartyLabel[locale]} onSelect={setIsPartySelected} />

      <Field label={T.fieldCustomInstructionsLabel[locale]}>
        <Textarea
          placeholder={T.fieldCustomInstructionsPlaceholder[locale]}
          rows={5}
          onChange={handleChangeCustomInstructions}
          defaultValue={formCustomInstructions ?? ""}
          className={styles.textarea}
        />
      </Field>

      <Button
        appearance="primary"
        size="large"
        onClick={handleStartAnalysis}
        disabled={!isPartiesExist || !isPartySelected}
      >
        {T.buttonStart[locale]}
      </Button>
    </div>
  );
};

export default observer(ReviewTypeCustom);
