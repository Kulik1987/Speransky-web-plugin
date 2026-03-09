import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import {
  ClipboardTaskListRtl24Regular,
  TaskListSquareAdd24Regular,
  TextBulletListSquareEdit24Regular,
} from "@fluentui/react-icons";
import { useStores } from "../../store";
import { useMainStyles } from "./styles";
import { Card } from "../../components/molecules";
import { RoutePathEnum } from "../../enums";
import { Anonymizer } from "../review/anonymizer";
import { Text } from "@fluentui/react-components";
import { useCommonStyles } from "../../theme/commonStyles";

const T = {
  pageTitle: {
    ru: "Выбрать действие",
    en: "Select action",
  },
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
  checklistTitle: {
    ru: "Настроить чек-листы",
    en: "Configure checklists",
  },
  checklistSubtitle: {
    ru: "Написать свои правила",
    en: "Write your own rules",
  },
  checklistText: {
    ru: "Создавайте свои правила для проверки",
    en: "Create your own rules for review",
  },
};

const Main = () => {
  const { menuStore, documentStore } = useStores();
  const { locale } = menuStore;
  const navigate = useNavigate();
  const commonStyles = useCommonStyles();
  const styles = useMainStyles();

  const handleNavigateToDraft = () => navigate(RoutePathEnum.DRAFT);
  const handleNavigateToReview = async () => navigate(RoutePathEnum.REVIEW);
  const handleNavigateToChecklist = async () => navigate(RoutePathEnum.CHECKLIST);

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
      <Text as="h1" weight="semibold" className={commonStyles.pageTitle}>
        {T.pageTitle[locale]}
      </Text>
      <Card
        title={T.reviewTitle[locale]}
        subtitle={T.reviewSubtitle[locale]}
        text={T.reviewText[locale]}
        icon={<ClipboardTaskListRtl24Regular />}
        onClick={handleNavigateToReview}
        disabled={isLoading}
      />
      <Card
        title={T.checklistTitle[locale]}
        subtitle={T.checklistSubtitle[locale]}
        text={T.checklistText[locale]}
        icon={<TaskListSquareAdd24Regular />}
        onClick={handleNavigateToChecklist}
      />
      <Card
        title={T.draftTitle[locale]}
        subtitle={T.draftSubtitle[locale]}
        text={T.draftText[locale]}
        icon={<TextBulletListSquareEdit24Regular />}
        onClick={handleNavigateToDraft}
        disabled
      />
      <Anonymizer />
    </div>
  );
};

export default observer(Main);
