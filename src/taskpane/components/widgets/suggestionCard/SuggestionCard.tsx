/* global Word console */
import React from "react";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { Button, Text, Tooltip } from "@fluentui/react-components";
import { DismissFilled, LocationRippleRegular } from "@fluentui/react-icons";
import { PriorityFlag } from "../../atoms";
import { ApplyService } from "../../../services/applyService";
import { SearchService } from "../../../services/searchService";
import { SuggestionT } from "../../../store/suggestions";
import { htmlChangesMatching } from "../../../helpers/diff";
import { RecommendationTypeEnum } from "../../../enums";

type SuggestionPropT = {
  index: number;
  data: SuggestionT;
};

const T = {
  buttonDismiss: {
    ru: "Удалить",
    en: "Dismiss",
  },
  buttonLocation: {
    ru: "Найти в тексте",
    en: "Search a location",
  },
  labelChange: {
    ru: "Правка:",
    en: "Change",
  },
  labelComment: {
    ru: "Комментарий:",
    en: "Comment",
  },
  buttonChange: {
    ru: "Применить правку",
    en: "Apply change",
  },
  buttonComment: {
    ru: "Добавить комментарий",
    en: "Add comment",
  },
};

const SuggestionCard = (props: SuggestionPropT) => {
  const { suggestionsStore, menuStore, configStore } = useStores();
  const { locale } = menuStore;
  const { optionsSupportedCurrentApi } = configStore;
  const { isAccessToRangeInsertComment } = optionsSupportedCurrentApi;

  const { data, index: indexSuggestion } = props;

  const {
    risk_description: commentText,
    risk_level,
    new_clause_wording: changeText,
    target_snippet_full: sourceText,
    is_new_clause,
    is_removed_clause,
    isDismiss,
  } = data;

  const type = is_new_clause
    ? RecommendationTypeEnum.ADD
    : is_removed_clause
    ? RecommendationTypeEnum.DELETE
    : RecommendationTypeEnum.EDIT;

  const htmlChangesMatchingText = (() => {
    return htmlChangesMatching(sourceText, changeText);
  })();

  const isTypeDelete = type === RecommendationTypeEnum.DELETE;
  const isTypeAdd = type === RecommendationTypeEnum.ADD;

  const isChangeExist = !!changeText || isTypeDelete;
  const isCommentExist = !!commentText;

  const handleShowInDocument = async () => {
    await Word.run(async (context) => {
      try {
        let findRange = await SearchService.findRange(context, changeText);
        if (findRange === null || isTypeDelete) {
          findRange = await SearchService.findRange(context, sourceText);
        }
        console.log("[handleShowInDocument] findRange", findRange);

        if (findRange === null) return;

        findRange.select();
        await context.sync();
      } catch (error) {
        throw error;
      }
    }).catch((error) => {
      console.log("Error [handleShowInDocument]: " + error);
    });
  };

  const handleApplyChange = async () => {
    ApplyService.applyChange({ sourceText, changeText, optionsSupportedCurrentApi, type })
      .then(() => {
        // suggestionsStore.setSuggestionProperty(indexSuggestion, { isApplyChange: true });
      })
      .catch((error) => {
        console.log("Error [handleApplyChange]: " + error);
      });
  };

  const handleAddComment = async () => {
    // const searchText = !isApplyChange ? sourceText : changeText;
    ApplyService.applyComment({ sourceText, changeText, commentText })
      .then(() => {
        // suggestionsStore.setSuggestionProperty(indexSuggestion, { isApplyComment: true });
      })
      .catch((error) => {
        console.log("Error [handleAddComment]: " + error);
      });
  };

  const handleDismiss = () => {
    suggestionsStore.setSuggestionProperty(indexSuggestion, { isDismiss: true });
  };

  if (isDismiss) return null;

  return (
    <div
      style={{
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 3px 5px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <PriorityFlag flag={risk_level} />
        <Button
          appearance="subtle"
          size="small"
          iconPosition="after"
          onClick={handleDismiss}
          icon={<DismissFilled fontSize={"1em"} color="grey" />}
        >
          {T.buttonDismiss[locale]}
        </Button>
      </div>
      {isChangeExist && (
        <div>
          <Text weight="bold">{T.labelChange[locale]} </Text>
          {isTypeAdd ? (
            <Text weight="bold" block style={{ color: "#099e1a" }}>
              {changeText}
            </Text>
          ) : isTypeDelete ? (
            <Text block style={{ textDecoration: "line-through", color: "#db690d" }}>
              {sourceText}
            </Text>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: htmlChangesMatchingText || changeText }} />
          )}
        </div>
      )}
      {isCommentExist && (
        <div>
          <Text weight="bold">{T.labelComment[locale]} </Text>
          <Text>{commentText}</Text>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "12px",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Tooltip content={T.buttonLocation[locale]} relationship="label">
            <Button
              appearance="outline"
              size="medium"
              onClick={handleShowInDocument}
              icon={<LocationRippleRegular color="#0f6cbd" />}
              style={{ borderColor: "#0f6cbd", borderWidth: "2px" }}
            />
          </Tooltip>
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            flexWrap: "wrap",
            flex: 1,
          }}
        >
          {isChangeExist && (
            <Button
              appearance="primary"
              size="medium"
              onClick={handleApplyChange}
              style={{ borderColor: "#0f6cbd", borderWidth: "2px", whiteSpace: "nowrap" }}
            >
              {T.buttonChange[locale]}
            </Button>
          )}
          {isCommentExist && (
            <Button
              appearance="primary"
              size="medium"
              onClick={handleAddComment}
              disabled={isAccessToRangeInsertComment === false}
              style={{
                borderColor: isAccessToRangeInsertComment ? "#0f6cbd" : "transparent",
                borderWidth: "2px",
                whiteSpace: "nowrap",
              }}
            >
              {T.buttonComment[locale]}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(SuggestionCard);
