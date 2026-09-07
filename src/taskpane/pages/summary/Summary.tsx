import React, { useEffect } from "react";
import { useStores } from "../../store";
import { SuggestionCard } from "../../components/widgets";
import { Button, Tooltip } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { ApplyService } from "../../services/applyService";
import { ItemSkeleton } from "../../components/molecules";
import { useSummaryStyles } from "./styles";
import { RecommendationTypeEnum, SuggestionsErrorTagEnum } from "../../enums";
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
    ru: "Скачать отчётные документы",
    en: "Download results",
  },
  tooltipDownloadArchive: {
    ru: "Отчётная таблица о правовых рисках, Договор с правками и примечаниями, Протокол разногласий в формате .docx",
    en: "Risk report table, Contract with tracked changes, Disagreement protocol in .docx format",
  },
  errorDescription: {
    ru: "Ошибка получения рекомендаций.\n Попробуйте ещё раз.",
    en: "Error getting recommendations.\n Please try again.",
  },
  errorDescriptionServer: {
    ru: "Ошибка сервера.\n Попробуйте повторить позже.",
    en: "Server error.\n Please try again later.",
  },
  errorDescriptionTimeout: {
    ru: "Превышено время ожидания результатов.\n Попробуйте запустить анализ ещё раз.",
    en: "The wait for results has timed out.\n Please try running the analysis again.",
  },
};

const Summary = () => {
  const { documentStore, suggestionsStore, menuStore, configStore } = useStores();
  const { locale } = menuStore;
  const { optionsSupportedCurrentApi } = configStore;
  const { isAccessToRangeInsertComment } = optionsSupportedCurrentApi;
  const styles = useSummaryStyles();

  const { isSuggestionExist, suggestionsNew, suggestionsError, suggestionsErrorMessage, isAnalysisProcessing } =
    suggestionsStore;
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
    if (!suggestionsNew) return;

    suggestionsNew.forEach(async (itemSuggestion, indexSuggestion) => {
      if (itemSuggestion.isDismiss) return;

      const {
        target_snippet_full: sourceText,
        new_clause_wording: changeText,
        recommendation: commentText,
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

  const getErrorText = () => {
    if (suggestionsErrorMessage) return suggestionsErrorMessage;

    switch (suggestionsError) {
      case SuggestionsErrorTagEnum.TIMEOUT_ERROR:
        return T.errorDescriptionTimeout[locale];
      case SuggestionsErrorTagEnum.SERVER_ERROR:
        return T.errorDescriptionServer[locale];
      default:
        return T.errorDescription[locale];
    }
  };

  if (isError || (!isAnalysisProcessing && !isSuggestionExist)) {
    return <ErrorText error={getErrorText()} />;
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
        <Tooltip
          content={{ children: T.tooltipDownloadArchive[locale], className: styles.tooltip }}
          relationship="description"
          positioning="above"
        >
          <Button appearance="primary" size="large" onClick={handleDownloadArchive}>
            {T.buttonDownloadArchive[locale]}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default observer(Summary);
