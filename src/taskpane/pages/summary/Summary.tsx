import React from "react";
import { useStores } from "../../store";
import { SuggestionCard } from "../../components/widgets";
import { Button, Divider, Text } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { ApplyService } from "../../services/applyService";
import { ItemSkeleton } from "../../components/molecules";
import { useSummaryStyles } from "./styles";

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

  const { suggestionsNew, suggestionsError, reviewTypeActive, reviewCustomProcessing, reviewGeneralProcessing } =
    suggestionsStore;

  const isProcessing = reviewCustomProcessing || reviewGeneralProcessing;
  const isDisplaySuggestions = reviewTypeActive !== null && !isProcessing;
  const isError = Boolean(suggestionsError);

  const handleApplyAll = async () => {
    suggestionsNew.forEach(async (itemSuggestion, indexSuggestion) => {
      const { part_contract: sourceText, part_modified: changeText, comment: commentText, type } = itemSuggestion;

      await ApplyService.applyChange({ sourceText, changeText, optionsSupportedCurrentApi, type })
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

  if (isError || (!isProcessing && !suggestionsNew?.length)) {
    return (
      <Text block className={styles.error}>
        {T.errorDescription[locale]}
      </Text>
    );
  }

  return (
    <div className={styles.container}>
      {isProcessing && (
        <div className={styles.block}>
          <Divider alignContent="center" inset>
            <Text size={300} weight="medium">
              {T.waitingNotification[locale]}
            </Text>
          </Divider>
          <ItemSkeleton />
        </div>
      )}
      {isDisplaySuggestions &&
        suggestionsNew?.map((data, index) => {
          return <SuggestionCard data={data} key={index} index={index} />;
        })}
      {
        // computedIsExistUntouchedSuggestions &&
        isDisplaySuggestions && (
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
