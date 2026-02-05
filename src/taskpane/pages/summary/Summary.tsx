import React, { useEffect, useState } from "react";
import { useStores } from "../../store";
import { SuggestionCard } from "../../components/widgets";
import { Button, Divider, Text } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { ApplyService } from "../../services/applyService";
import { ItemSkeleton, PopoverWarning } from "../../components/molecules";
import { useSummaryStyles } from "./styles";
import { RecommendationTypeEnum, RoutePathEnum } from "../../enums";
import { ErrorText } from "../../components/atoms";
import { ArrowLeft20Regular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";

const T = {
  waitingNotification: {
    ru: "Идёт подготовка рекомендаций",
    en: "Please await",
  },
  buttonApplyAll: {
    ru: "Применить все",
    en: "Apply All",
  },
  buttonDownloadArchive: {
    ru: "Скачать результат",
    en: "Download result",
  },
  errorDescription: {
    ru: "Ошибка получения рекомендаций.\n Попробуйте ещё раз.",
    en: "Error getting recommendations.\n Please try again.",
  },
  popoverMessage: {
    ru: "Рекомендации будут потеряны.\n Уйти со страницы?",
    en: "Recommendations will be lost.\n Leave the page?",
  },
};

const Summary = () => {
  const { documentStore, suggestionsStore, menuStore, configStore } = useStores();
  const { locale } = menuStore;
  const { optionsSupportedCurrentApi } = configStore;
  const { isAccessToRangeInsertComment } = optionsSupportedCurrentApi;
  const styles = useSummaryStyles();
  const navigate = useNavigate();

  const { isSuggestionExist, suggestionsNew, suggestionsError, isAnalysisProcessing } = suggestionsStore;
  const isError = Boolean(suggestionsError);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    console.log("navigate to [page summary]");

    const loadSuggestions = async () => {
      if (!isAnalysisProcessing && !isSuggestionExist) {
        await suggestionsStore.runAnalysis();
      }
    };

    loadSuggestions();
  }, []);

  const handleConfirmLeave = () => {
    setIsPopoverOpen(false);
    navigate(RoutePathEnum.ROOT);
  };

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

  return (
    <div className={styles.container}>
      {isAnalysisProcessing ? (
        <div className={styles.block}>
          <Divider alignContent="center" inset>
            <Text size={300} weight="medium">
              {T.waitingNotification[locale]}
            </Text>
          </Divider>
          <ItemSkeleton />
        </div>
      ) : (
        <>
          <PopoverWarning
            message={T.popoverMessage[locale]}
            trigger={<Button appearance="transparent" icon={<ArrowLeft20Regular />} />}
            isOpen={isPopoverOpen}
            setIsOpen={setIsPopoverOpen}
            onConfirm={handleConfirmLeave}
          />

          {suggestionsNew?.map((data, index) => {
            return <SuggestionCard data={data} key={index} index={index} />;
          })}

          <div className={styles.block}>
            <Button appearance="primary" size="medium" onClick={handleApplyAll}>
              {T.buttonApplyAll[locale]}
            </Button>
            <Divider />
            <Button appearance="primary" size="medium" onClick={handleDownloadArchive}>
              {T.buttonDownloadArchive[locale]}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default observer(Summary);
