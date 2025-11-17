import React from "react";
import { useStores } from "../../store";
import { SuggestionCard } from "../../components/widgets";
import { Button, Divider, Text } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { ApplyService } from "../../services/applyService";
import { ItemSkeleton } from "../../components/molecules";

const T = {
  waitingNotification: {
    ru: "Идёт подготовка рекомендаций",
    en: "Please await",
  },
  buttonApplyAll: {
    ru: "Применить все",
    en: "Apply All",
  },
};

const Summary = () => {
  const { suggestionsStore, menuStore, configStore } = useStores();
  const { locale } = menuStore;
  const { optionsSupportedCurrentApi } = configStore;
  const { isAccessToRangeInsertComment } = optionsSupportedCurrentApi;

  const {
    // computedIsExistUntouchedSuggestions,
    suggestionsNew,
  } = suggestionsStore;

  const { reviewTypeActive, reviewCustomProcessing, reviewGeneralProcessing } = suggestionsStore;

  const isProcessing = reviewCustomProcessing || reviewGeneralProcessing;
  const isDisplaySuggestions = reviewTypeActive !== null && !isProcessing;

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {isProcessing && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
        !isProcessing && (
          <div>
            <Button
              appearance="primary"
              size="medium"
              onClick={handleApplyAll}
              style={{ borderColor: "#0f6cbd", borderWidth: "2px", whiteSpace: "nowrap" }}
            >
              {T.buttonApplyAll[locale]}
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default observer(Summary);
