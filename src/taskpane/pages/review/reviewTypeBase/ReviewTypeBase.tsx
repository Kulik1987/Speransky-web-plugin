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
import { IconButton } from "../../../components/atoms";

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
  listTitle: {
    ru: "Сохранённые чек-листы",
    en: "Saved checklists",
  },
  btnStartReview: {
    ru: "Начать проверку",
    en: "Start review",
  },
};

type ReviewTypeBaseProps = {
  listContent: ReactNode;
  actionIcon?: ReactElement;
  actionHandleClick?: () => void;
  onStartReview: () => void;
};

const iconStyle = { width: "9px", height: "9px", padding: "8px" };

const ReviewTypeBase = (props: ReviewTypeBaseProps) => {
  const { listContent, actionIcon, actionHandleClick, onStartReview } = props;
  const { menuStore, suggestionsStore } = useStores();
  const { locale } = menuStore;
  const commonStyles = useCommonStyles();
  const styles = useReviewTypeBaseStyles();

  const [isPartySelected, setIsPartySelected] = useState(false);
  const [docType, setDocType] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles.container}>
      <Dropdown
        size="large"
        placeholder={T.docTypePlaceholder[locale]}
        onOptionSelect={(_, data) => setDocType(data.optionValue ?? "")}
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

      <Accordion collapsible className={commonStyles.accordion} onToggle={handleToggle} openItems={isOpen ? [1] : []}>
        <AccordionItem className={commonStyles.accordionItem} value={1}>
          <AccordionHeader
            className={mergeClasses(commonStyles.pageTitle, commonStyles.accordionHeader, styles.accordionHeader)}
            expandIcon={isOpen ? <TriangleDownFilled style={iconStyle} /> : <TriangleRightFilled style={iconStyle} />}
          >
            {T.listTitle[locale]}
          </AccordionHeader>
          <AccordionPanel className={mergeClasses(commonStyles.accordionPanel, styles.accordionPanel)}>
            {listContent}
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
