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
  Option,
} from "@fluentui/react-components";
import { Add16Filled, TriangleDownFilled, TriangleRightFilled } from "@fluentui/react-icons";
import { PartyDropdown } from "../../../components/molecules";
import { useReviewTypeBaseStyles } from "./styles";

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
      >
        <Option key={suggestionsStore.documentType} value={suggestionsStore.documentType}>
          {suggestionsStore.documentType}
        </Option>
      </Dropdown>

      <PartyDropdown placeholder={T.partyPlaceholder[locale]} onSelect={setIsPartySelected} />

      <Accordion collapsible className={styles.accordion} onToggle={handleToggle} openItems={isOpen ? [1] : []}>
        <AccordionItem className={styles.accordionItem} value={1}>
          <AccordionHeader
            className={styles.accordionHeader}
            expandIcon={isOpen ? <TriangleDownFilled style={iconStyle} /> : <TriangleRightFilled style={iconStyle} />}
          >
            {T.listTitle[locale]}
          </AccordionHeader>
          <AccordionPanel className={styles.accordionPanel}>{listContent}</AccordionPanel>
          {(actionIcon || actionHandleClick) && isOpen && (
            <Button
              icon={actionIcon || <Add16Filled />}
              appearance="primary"
              size="small"
              onClick={actionHandleClick}
              className={styles.accordionActions}
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
