import React, { ReactElement, ReactNode, useState } from "react";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Dropdown,
  mergeClasses,
  Option,
} from "@fluentui/react-components";
import { Add16Filled, TriangleDownFilled, TriangleRightFilled } from "@fluentui/react-icons";
import { PartyDropdown } from "../../../components/molecules";
import { useReviewTypeBaseStyles } from "./styles";
import { useCommonStyles } from "../../../theme/commonStyles";
import { IconButton, SearchBox } from "../../../components/atoms";
import { ReviewTypesEnums } from "../../../enums";
const emptyState = require("../../../assets/empty-state-2.svg");

const T = {
  docTypePlaceholder: {
    ru: "Тип договора",
    en: "Contract type",
  },
  partyPlaceholder: {
    ru: "Сторона договора",
    en: "Party",
  },
  btnCreateChecklist: {
    ru: "Добавить новый чек-лист",
    en: "Add new checklist",
  },
  allPartiesValue: {
    ru: "Все стороны",
    en: "All parties",
  },
  listTitleGeneral: {
    ru: "Чек-листы Speransky",
    en: "Speransky checklists",
  },
  listTitleCustom: {
    ru: "Пользовательские чек-листы",
    en: "Custom checklists",
  },
  searchBoxPlaceholder: {
    ru: "Найти по названию",
    en: "Search by name",
  },
  emptyTitle: {
    ru: "У Вас пока не создано ни одного чек-листа",
    en: "You have no checklists yet",
  },
  btnStartReview: {
    ru: "Начать проверку",
    en: "Start review",
  },
};

type ReviewTypeBaseProps = {
  type: ReviewTypesEnums;
  listContent: ReactNode;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  actionIcon?: ReactElement;
  actionHandleClick?: () => void;
  onStartReview: () => void;
};

const iconStyle = { width: "12px", height: "12px", padding: "5px" };

const ReviewTypeBase = (props: ReviewTypeBaseProps) => {
  const { type, listContent, searchQuery = "", onSearchChange, actionIcon, actionHandleClick, onStartReview } = props;
  const { menuStore, suggestionsStore } = useStores();
  const { locale } = menuStore;
  const commonStyles = useCommonStyles();
  const styles = useReviewTypeBaseStyles();

  const [isPartySelected, setIsPartySelected] = useState(false);
  const [docType, setDocType] = useState(suggestionsStore.documentType);
  const [isOpen, setIsOpen] = useState(true);

  const isGeneral = type === ReviewTypesEnums.GENERAL;
  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles.container}>
      <Dropdown
        size="large"
        placeholder={T.docTypePlaceholder[locale]}
        onOptionSelect={(_, data) => setDocType(data.optionValue ?? "")}
        value={docType}
        disabled={!suggestionsStore.documentType}
        className={mergeClasses(commonStyles.dropdown, docType && commonStyles.inputFill)}
      >
        <Option key={suggestionsStore.documentType} value={suggestionsStore.documentType}>
          {suggestionsStore.documentType}
        </Option>
      </Dropdown>

      <PartyDropdown
        placeholder={T.partyPlaceholder[locale]}
        onSelect={setIsPartySelected}
        isFilled={isPartySelected}
      />

      <Accordion
        collapsible={!isGeneral}
        className={commonStyles.accordion}
        onToggle={isGeneral ? undefined : handleToggle}
        openItems={isGeneral ? [1] : isOpen ? [1] : []}
      >
        <AccordionItem className={commonStyles.accordionItem} value={1}>
          <AccordionHeader
            className={mergeClasses(commonStyles.accordionHeader, styles.accordionHeader)}
            expandIcon={
              isGeneral ? null : isOpen ? (
                <TriangleDownFilled style={iconStyle} />
              ) : (
                <TriangleRightFilled style={iconStyle} />
              )
            }
          >
            {isGeneral ? T.listTitleGeneral[locale] : T.listTitleCustom[locale]}
          </AccordionHeader>

          <AccordionPanel className={commonStyles.accordionPanel}>
            {!isGeneral && listContent && (
              <SearchBox value={searchQuery} onChange={onSearchChange} placeholder={T.searchBoxPlaceholder[locale]} />
            )}
            {listContent || (
              <div className={styles.emptyBlock}>
                <span className={styles.emptyTitle}>{T.emptyTitle[locale]}</span>
                <img alt="empty" src={emptyState} width="68px" height="66px" />
              </div>
            )}
          </AccordionPanel>

          {(actionIcon || actionHandleClick) && isOpen && (
            <IconButton
              tooltip={T.btnCreateChecklist[locale]}
              icon={actionIcon || <Add16Filled />}
              onClick={actionHandleClick}
              positioning="above-end"
              appearance="primary"
              className={commonStyles.accordionActions}
            />
          )}
        </AccordionItem>
      </Accordion>

      <Button appearance="primary" size="large" disabled={!isPartySelected || !docType} onClick={onStartReview}>
        {T.btnStartReview[locale]}
      </Button>
    </div>
  );
};

export default observer(ReviewTypeBase);
