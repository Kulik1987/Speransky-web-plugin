import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { Button, tokens } from "@fluentui/react-components";
import { DocumentBulletList24Regular } from "@fluentui/react-icons";
import { useStores } from "../../../store";
import { useReviewTypeGeneralStyles } from "./styles";
import { PartyDropdown } from "../../../components/molecules";

const T = {
  expertiseLabel: {
    ru: "Глубокая экспертиза",
    en: "Deep expertise",
  },
  expertiseOptions: {
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
  buttonStart: {
    ru: "Начать проверку",
    en: "Start review",
  },
};

const ReviewTypeGeneral = () => {
  const { suggestionsStore, menuStore } = useStores();
  const { locale } = menuStore;
  const navigate = useNavigate();
  const { parties } = suggestionsStore;
  const styles = useReviewTypeGeneralStyles();

  const [isExpertiseOpen, setIsExpertiseOpen] = useState(false);
  const [isPartySelected, setIsPartySelected] = useState(false);
  const isPartiesExist = Array.isArray(parties) && parties?.length > 0;

  const handleStartAnalysis = async () => navigate("/summary");

  return (
    <div className={styles.container}>
      <div className={styles.expandableList}>
        <div className={styles.expandableHeader} onClick={() => setIsExpertiseOpen(!isExpertiseOpen)}>
          <DocumentBulletList24Regular primaryFill={tokens.colorBrandForeground2} />
          <span className={styles.expandableHeaderText}>{T.expertiseLabel[locale]}</span>
        </div>
        {isExpertiseOpen && (
          <div className={styles.expandableContent}>
            {T.expertiseOptions[locale].map((option) => (
              <div key={option} className={styles.expandableItem}>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <PartyDropdown placeholder={T.selectPartyLabel[locale]} onSelect={setIsPartySelected} />

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

export default observer(ReviewTypeGeneral);
