import React, { useEffect } from "react";
import { useStores } from "../../store";
import { SuggestionCard } from "../../components/widgets";
import { Button, Divider, Text } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { ApplyService } from "../../services/applyService";
import { ItemSkeleton } from "../../components/molecules";
import { useSummaryStyles } from "./styles";
import { RecommendationTypeEnum } from "../../enums";

const T = {
  waitingNotification: {
    ru: "Идёт подготовка рекомендаций",
    en: "Please await",
  },
  buttonApplyAll: {
    ru: "Применить все",
    en: "Apply All",
  },
  errorDescription: {
    ru: "Ошибка получения рекомендаций.\n Попробуйте ещё раз.",
    en: "Error getting recommendations.\n Please try again.",
  },
};

const Summary = () => {
  const { suggestionsStore, menuStore, configStore } = useStores();
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

  if (isError || (!isAnalysisProcessing && !isSuggestionExist)) {
    return (
      <Text block className={styles.error}>
        {T.errorDescription[locale]}
      </Text>
    );
  }

  return (
    <div className={styles.container}>
      {isAnalysisProcessing && (
        <div className={styles.block}>
          <Divider alignContent="center" inset>
            <Text size={300} weight="medium">
              {T.waitingNotification[locale]}
            </Text>
          </Divider>
          <ItemSkeleton />
        </div>
      )}
      {!isAnalysisProcessing &&
        suggestionsNew?.map((data, index) => {
          return <SuggestionCard data={data} key={index} index={index} />;
        })}
      {
        // computedIsExistUntouchedSuggestions &&
        !isAnalysisProcessing && (
          <div>
            <Button appearance="primary" size="medium" onClick={handleApplyAll} className={styles.button}>
              {T.buttonApplyAll[locale]}
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default observer(Summary);
