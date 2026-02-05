import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { DocumentSignature24Regular, TextBulletListSquareSearch20Regular } from "@fluentui/react-icons";
import { useStores } from "../../store";
import { useMainStyles } from "./styles";
import { Card } from "../../components/molecules";
import { RoutePathEnum } from "../../enums";

const T = {
  reviewTitle: {
    ru: "Проверить договор",
    en: "Check the contract",
  },
  reviewSubtitle: {
    ru: "Открыть и проверить документ",
    en: "Open and check the document",
  },
  reviewText: {
    ru: "Откройте документ, который хотите проверить",
    en: "Open the document you want to check",
  },
  draftTitle: {
    ru: "Создать новый договор",
    en: "Create a new contract",
  },
  draftSubtitle: {
    ru: "Написать новый документ",
    en: "Write a new document",
  },
  draftText: {
    ru: "Создайте новый документ, который хотите проверить",
    en: "Create a new document that you want to check",
  },
};

const Main = () => {
  const { menuStore, documentStore } = useStores();
  const { locale } = menuStore;
  const navigate = useNavigate();
  const styles = useMainStyles();

  const handleNavigateToDraft = () => navigate(RoutePathEnum.DRAFT);
  const handleNavigateToReview = async () => navigate(RoutePathEnum.REVIEW);

  useEffect(() => {
    if (documentStore.textContractSource === null) {
      //TODO Тут надо решить в какой момент:
      //TODO - обновлять контракт в сторе
      //TODO - повторно запрашивать Стороны
      // а пока контракт обновляется единожды при старте приложения
      documentStore.copyTextContractToStore();
    }
  }, []);

  const isLoading = documentStore.isFetchingDetectDocumentType;

  return (
    <div className={styles.root}>
      <Card
        title={T.reviewTitle[locale]}
        subtitle={T.reviewSubtitle[locale]}
        text={T.reviewText[locale]}
        icon={<TextBulletListSquareSearch20Regular />}
        onClick={handleNavigateToReview}
        disabled={isLoading}
      />
      <Card
        title={T.draftTitle[locale]}
        subtitle={T.draftSubtitle[locale]}
        text={T.draftText[locale]}
        icon={<DocumentSignature24Regular />}
        onClick={handleNavigateToDraft}
        disabled
      />
    </div>
  );
};

export default observer(Main);
