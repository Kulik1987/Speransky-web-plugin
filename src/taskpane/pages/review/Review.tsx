import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { mergeClasses, Text } from "@fluentui/react-components";
import { useStores } from "../../store";
import { Card, ItemSkeleton } from "../../components/molecules";
import { useReviewStyles } from "./styles";
import { useNavigate } from "react-router-dom";
import { RoutePathEnum } from "../../enums";
import { DocumentBulletList24Regular, Settings24Regular } from "@fluentui/react-icons";
import { useCommonStyles } from "../../theme/commonStyles";

const T = {
  title: {
    ru: "Тип проверки",
    en: "Select review type",
  },
  generalTitle: {
    ru: "Общая",
    en: "General",
  },
  generalText: {
    ru: "Анализ на базовые риски и спорные пункты",
    en: "Scan for obvious risks and issues",
  },
  customTitle: {
    ru: "Индивидуальная",
    en: "Custom",
  },
  customText: {
    ru: "Создавайте и сохраняйте свои правила для проверки",
    en: "Create and save your own rules for review",
  },
  waitingNotification: {
    ru: "Идёт анализ сторон",
    en: "Please wait",
  },
  errorDescription: {
    ru: "Ошибка определения сторон договора.\n Попробуйте ещё раз.",
    en: "Error getting contract parties.\n Please try again.",
  },
};

const Review = () => {
  const { menuStore, documentStore, suggestionsStore } = useStores();
  const { locale } = menuStore;
  const { parties, partiesError, isPartiesProcessing } = suggestionsStore;
  const isError = Boolean(partiesError);
  const navigate = useNavigate();
  const commonStyles = useCommonStyles();
  const styles = useReviewStyles();

  useEffect(() => {
    console.log("navigate to [page review]");

    const loadParties = async () => {
      if (!parties && !isPartiesProcessing) {
        await suggestionsStore.requestParties(documentStore.documentId);
      }
    };

    loadParties();
  }, []);

  const handleNavigateToReviewType = () => {
    navigate(RoutePathEnum.REVIEW_TYPE);
  };
  const handleNavigateToReviewGeneral = () => {
    navigate(RoutePathEnum.REVIEW_GENERAL);
  };
  const handleNavigateToReviewCustom = () => {
    navigate(RoutePathEnum.REVIEW_CUSTOM);
  };

  if (isError || (!parties && !isPartiesProcessing)) {
    console.log("error parties review", isError, partiesError);
    return (
      <Text block className={mergeClasses(commonStyles.error, styles.error)}>
        {T.errorDescription[locale]}
      </Text>
    );
  }

  return (
    <div className={styles.container}>
      {documentStore.isFetchingDetectDocumentType ? (
        <>
          <Text size={300} weight="medium">
            {T.waitingNotification[locale]}
          </Text>
          <ItemSkeleton />
        </>
      ) : (
        <>
          <Text as="h1" weight="semibold" className={styles.title}>
            {T.title[locale]}
          </Text>
          <div className={styles.block}>
            <Card
              title={T.generalTitle[locale]}
              text={T.generalText[locale]}
              icon={<DocumentBulletList24Regular />}
              onClick={handleNavigateToReviewGeneral}
            />
            <Card
              title={T.customTitle[locale]}
              text={T.customText[locale]}
              icon={<Settings24Regular />}
              onClick={handleNavigateToReviewCustom}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default observer(Review);
