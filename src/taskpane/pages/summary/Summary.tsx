import React, { useEffect } from "react";
import { useStores } from "../../store";
import { SuggestionCard } from "../../components/widgets";
import { Button } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { ApplyService } from "../../services/applyService";
import { ItemSkeleton } from "../../components/molecules";
import { useSummaryStyles } from "./styles";
import { RecommendationTypeEnum } from "../../enums";
import { ErrorText } from "../../components/atoms";

const T = {
  waitingNotification: {
    ru: "Идёт подготовка рекомендаций",
    en: "Please await",
  },
  buttonApplyAll: {
    ru: "Применить все правки",
    en: "Apply all edits",
  },
  buttonDownloadArchive: {
    ru: "Скачать результаты",
    en: "Download results",
  },
  errorDescription: {
    ru: "Ошибка получения рекомендаций.\n Попробуйте ещё раз.",
    en: "Error getting recommendations.\n Please try again.",
  },
};

const Summary = () => {
  const { documentStore, suggestionsStore, menuStore, configStore } = useStores();
  const { locale } = menuStore;
  const { optionsSupportedCurrentApi } = configStore;
  const { isAccessToRangeInsertComment } = optionsSupportedCurrentApi;
  const styles = useSummaryStyles();

  const { isSuggestionExist, suggestionsNew, suggestionsError, isAnalysisProcessing } = suggestionsStore;
  const isError = Boolean(suggestionsError);

  useEffect(() => {
    console.log("navigate to [page summary]");

    const loadSuggestions = async () => {
      if (!isAnalysisProcessing && !isSuggestionExist) {
        await suggestionsStore.runAnalysis();
      }
    };

    loadSuggestions();
  }, []);

  const handleApplyAll = async () => {
    suggestionsNew.forEach(async (itemSuggestion, indexSuggestion) => {
      if (itemSuggestion.isDismiss) return;

      const {
        target_snippet_full: sourceText,
        new_clause_wording: changeText,
        risk_description: commentText,
        is_new_clause,
        is_removed_clause,
      } = itemSuggestion;

      const changeType = is_new_clause
        ? RecommendationTypeEnum.ADD
        : is_removed_clause
        ? RecommendationTypeEnum.DELETE
        : RecommendationTypeEnum.EDIT;

      await ApplyService.applyChange({ sourceText, changeText, optionsSupportedCurrentApi, type: changeType })
        .then(() => {
          console.log("applyChange success");
        })
        .catch((error) => {
          console.log("Error [handleApplyAll]: " + error);
        });

      if (isAccessToRangeInsertComment) {
        await ApplyService.applyComment({ sourceText, changeText, commentText })
          .then(() => {
            suggestionsStore.setSuggestionProperty(indexSuggestion, { isApplyComment: true });
          })
          .catch((error) => {
            console.log("Error [handleAddComment]: " + error);
          });
      }
    });
  };

  const handleDownloadArchive = async () => {
    await documentStore.downloadArchive();
  };

  if (isError || (!isAnalysisProcessing && !isSuggestionExist)) {
    return <ErrorText error={T.errorDescription[locale]} />;
  }

  if (isAnalysisProcessing) {
    return <ItemSkeleton title={T.waitingNotification[locale]} />;
  }

  return (
    <div className={styles.container}>
      {suggestionsNew?.map((data, index) => {
        return <SuggestionCard data={data} key={index} index={index} />;
      })}

      <div className={styles.block}>
        {suggestionsNew && (
          <Button appearance="primary" size="large" onClick={handleApplyAll}>
            {T.buttonApplyAll[locale]}
          </Button>
        )}
        <Button appearance="primary" size="large" onClick={handleDownloadArchive}>
          {T.buttonDownloadArchive[locale]}
        </Button>
      </div>
    </div>
  );
};

export default observer(Summary);
