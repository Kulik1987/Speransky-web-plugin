/* global Word console */
import React, { useState } from "react";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { Text, tokens, Tooltip } from "@fluentui/react-components";
import {
  CheckboxChecked24Regular,
  CommentNote24Regular,
  Delete24Regular,
  LocationRipple24Regular,
  PersonNote16Regular,
} from "@fluentui/react-icons";
import { IconButton, Modal, PartyFlag, PriorityFlag } from "../../atoms";
import { ApplyService } from "../../../services/applyService";
import { SearchService } from "../../../services/searchService";
import { SuggestionT } from "../../../store/suggestions";
import { htmlChangesMatching, normalizeTabsForDisplay } from "../../../helpers/diff";
import { MARKDOWN_LINK_SOURCE } from "../../../helpers/convert";
import { RecommendationTypeEnum } from "../../../enums";
import { useSuggestionCardStyles } from "./styles";
import { customColors } from "../../../theme/theme";

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
    ru: "Местоположение в документе",
    en: "Location in contract",
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
  deleteRecommendationTitle: {
    ru: "Удалить рекомендацию из списка?",
    en: "Delete recommendation from list?",
  },
  deleteConfirm: {
    ru: "Удалить",
    en: "Delete",
  },
};

const SuggestionCard = (props: SuggestionPropT) => {
  const { suggestionsStore, menuStore, configStore } = useStores();
  const { resultChecklistId, resultChecklistName } = suggestionsStore;
  const { locale } = menuStore;
  const { optionsSupportedCurrentApi } = configStore;
  const { isAccessToRangeInsertComment } = optionsSupportedCurrentApi;
  const styles = useSuggestionCardStyles();

  const { data, index: indexSuggestion } = props;

  const {
    recommendation: commentText,
    risk_level,
    new_clause_wording: changeText,
    target_snippet_full: sourceText,
    relevant_party,
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState<"location" | "apply" | "comment" | null>(null);

  const locateInDocument = async () => {
    await Word.run(async (context) => {
      try {
        let findRange = await SearchService.findRange(context, changeText);
        if (findRange === null || isTypeDelete) {
          findRange = await SearchService.findRange(context, sourceText);
        }
        console.log("[locateInDocument] findRange", findRange);

        if (findRange === null) return;
        findRange.select();
        await context.sync();
      } catch (error) {
        throw error;
      }
    }).catch((error) => {
      console.log("Error [locateInDocument]: " + error);
    });
  };

  const handleShowInDocument = async () => {
    setLoadingButton("location");
    await locateInDocument().finally(() => setLoadingButton(null));
  };

  const handleApplyChange = async () => {
    setLoadingButton("apply");
    ApplyService.applyChange({ sourceText, changeText, optionsSupportedCurrentApi, type })
      .then(() => {
        // suggestionsStore.setSuggestionProperty(indexSuggestion, { isApplyChange: true });
      })
      .catch((error) => {
        console.log("Error [handleApplyChange]: " + error);
      })
      .finally(() => {
        setLoadingButton(null);
      });
  };

  const handleAddComment = async () => {
    // const searchText = !isApplyChange ? sourceText : changeText;
    setLoadingButton("comment");
    ApplyService.applyComment({ sourceText, changeText, commentText })
      .then(() => {
        // suggestionsStore.setSuggestionProperty(indexSuggestion, { isApplyComment: true });
      })
      .catch((error) => {
        console.log("Error [handleAddComment]: " + error);
      })
      .finally(() => {
        setLoadingButton(null);
      });
  };

  const handleDismiss = () => {
    suggestionsStore.setSuggestionProperty(indexSuggestion, { isDismiss: true });
  };

  if (isDismiss) return null;

  const handleDeleteRecommendation = () => setIsModalOpen(true);
  const handleDeleteConfirm = () => {
    setIsModalOpen(false);
    handleDismiss();
  };

  const renderWithLinks = (text: string, linkClassName?: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const re = new RegExp(MARKDOWN_LINK_SOURCE, "g");
    while ((match = re.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={linkClassName}
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  };

  return (
    <div className={styles.container} onClick={locateInDocument}>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={T.deleteRecommendationTitle[locale]}
        actionButtonTitle={T.deleteConfirm[locale]}
        onAction={handleDeleteConfirm}
      />

      <div className={styles.topBlock}>
        <div className={styles.flagBlock}>
          <PriorityFlag flag={risk_level} />
          <PartyFlag flag={relevant_party} />
        </div>
        {resultChecklistId && (
          <span onClick={(e) => e.stopPropagation()}>
            <IconButton
              tooltip={resultChecklistName || ""}
              icon={<PersonNote16Regular color={customColors.accent.note} />}
              onClick={() => {}}
              positioning="above-start"
              className={styles.checklistIcon}
            />
          </span>
        )}
      </div>

      <div className={styles.changesBlock}>
        {isChangeExist && (
          <div>
            <Text weight="bold">{T.labelChange[locale]}</Text>
            {isTypeAdd ? (
              <Text className={styles.addText}>{normalizeTabsForDisplay(changeText)}</Text>
            ) : isTypeDelete ? (
              <Text className={styles.deleteText}>{sourceText}</Text>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: htmlChangesMatchingText || changeText }} />
            )}
          </div>
        )}
        {isCommentExist && (
          <div>
            <Text weight="bold">{T.labelComment[locale]}</Text>
            <Text block>{renderWithLinks(commentText, styles.commentLink)}</Text>
          </div>
        )}
      </div>

      <div className={styles.buttonsBlock}>
        <div className={styles.changeButtons}>
          <span onClick={(e) => e.stopPropagation()}>
            <IconButton
              tooltip={T.buttonLocation[locale]}
              icon={<LocationRipple24Regular color={tokens.colorBrandForeground2} />}
              onClick={handleShowInDocument}
              positioning="above-start"
              loading={loadingButton === "location"}
            />
          </span>
          {isChangeExist && (
            <IconButton
              tooltip={T.buttonChange[locale]}
              icon={<CheckboxChecked24Regular color={tokens.colorBrandForeground2} />}
              onClick={handleApplyChange}
              positioning="above-start"
              loading={loadingButton === "apply"}
            />
          )}
          {isCommentExist && (
            <IconButton
              tooltip={T.buttonComment[locale]}
              icon={<CommentNote24Regular color={tokens.colorBrandForeground2} />}
              onClick={handleAddComment}
              positioning="above-start"
              disabled={isAccessToRangeInsertComment === false}
              loading={loadingButton === "comment"}
            />
          )}
        </div>
        <IconButton
          tooltip={T.buttonDismiss[locale]}
          icon={<Delete24Regular color={tokens.colorBrandForeground2} />}
          onClick={handleDeleteRecommendation}
          positioning="above-end"
        />
      </div>
    </div>
  );
};

export default observer(SuggestionCard);
