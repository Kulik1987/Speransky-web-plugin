import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useStores } from "../../store";
import { useChecklistStyles } from "./styles";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Dropdown,
  Input,
  Option,
} from "@fluentui/react-components";
import {
  Add16Filled,
  ArrowLeftRegular,
  Save16Regular,
  TriangleDownFilled,
  TriangleRightFilled,
} from "@fluentui/react-icons";
import { ALL_PARTIES, ALL_CONTRACT_TYPES } from "../../constants";
import { ChecklistCard } from "../../components/molecules";
import { ChecklistForm } from "../../components/organisms";
import { DraftRule } from "../../store/checklist";
import { Modal } from "../../components/atoms";
import { getMaxLengthError, sanitizeFieldValue } from "../../helpers";

const T = {
  pageCreateTitle: {
    ru: "Создание чек-листа",
    en: "Create checklist",
  },
  btnCreateChecklist: {
    ru: "Добавить новый",
    en: "Add new checklist",
  },
  formCreatingTitle: {
    ru: "Новый чек-лист",
    en: "New checklist",
  },
  pageEditTitle: {
    ru: "Редактирование  чек-листа",
    en: "",
  },
  docTypePlaceholder: {
    ru: "Тип договора",
    en: "Contract type",
  },
  partyPlaceholder: {
    ru: "Сторона договора",
    en: "Party",
  },
  allPartiesValue: {
    ru: "Все стороны",
    en: "All parties",
  },
  checklistNamePlaceholder: {
    ru: "Рекомендуемое название чек-листа",
    en: "Recommended checklist name",
  },
  btnSaveChecklist: {
    ru: "Сохранить чек-лист",
    en: "Save checklist",
  },
  listTitle: {
    ru: "Сохранённые чек-листы",
    en: "Saved checklists",
  },
  modalDeleteTitle: {
    ru: "Удалить чек-лист",
    en: "Delete checklist",
  },
  modalDeleteConfirm: {
    ru: "Удалить",
    en: "Delete",
  },
  modalSaveTitle: {
    ru: "Сохранить новый чек-лист?",
    en: "Save new checklist?",
  },
  modalEditTitle: {
    ru: "Сохранить внесённые изменения?",
    en: "Save updates?",
  },
  modalSaveConfirm: {
    ru: "Сохранить",
    en: "Save",
  },
};

const iconStyle = { width: "9px", height: "9px", padding: "8px" };

const Checklist = () => {
  const { menuStore, checkList } = useStores();
  const { locale } = menuStore;
  const styles = useChecklistStyles();

  const isEditing = !!checkList.editingChecklistId;

  const [party, setParty] = useState("");
  const [docType, setDocType] = useState("");
  const [checklistName, setChecklistName] = useState("");
  const [checklistRules, setChecklistRules] = useState<DraftRule[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const [openItem, setOpenItems] = useState<number[]>([]);
  const handleToggle = useCallback((_, data) => {
    const value = data.value as number;
    setOpenItems((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }, []);

  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  useEffect(() => {
    checkList.getChecklists();
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setChecklistName([docType, party].filter(Boolean).join(" - "));
    }
  }, [docType, party, checkList.editingChecklistId]);

  useEffect(() => {
    const id = checkList.editingChecklistId;
    if (!id) return;

    setIsFormOpen(false);
    setChecklistRules([]);

    checkList.getChecklistById(id).then((data) => {
      if (!data) return;
      setDocType(data.doc_type ?? "");
      setParty(data.party ?? "");
      setChecklistName(data.name);
      setChecklistRules([...checkList.checklistRules]);
      setIsFormOpen(true);
      setOpenItems([1]);
    });
  }, [checkList.editingChecklistId]);

  const handleOpenChecklistForm = () => {
    setIsFormOpen(true);
    setOpenItems([1]);
  };

  const handleSubmitChecklist = async () => {
    setIsSaveModalOpen(false);
    const success = await checkList.submitDraft(
      checklistName,
      docType,
      party === T.allPartiesValue[locale] ? "" : party,
      checklistRules
    );
    if (success) {
      setIsFormOpen(false);
      setChecklistRules([]);
      setChecklistName("");
      setDocType("");
      setParty("");
      setOpenItems([2]);
    }
  };

  const handleEdit = (id: string) => {
    checkList.setEditingChecklistId(id);
  };

  const handleDuplicate = async (id: string) => {
    await checkList.duplicateChecklist(id);
  };

  const handleDelete = (id: string) => setTargetId(id);
  const handleDeleteConfirm = async () => {
    await checkList.deleteChecklist(targetId);
    setTargetId(null);
  };

  const validationName = getMaxLengthError(checklistName, locale, 255);

  if (checkList.isDraftLoading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <Modal
        open={targetId !== null}
        onClose={() => setTargetId(null)}
        title={T.modalDeleteTitle[locale]}
        actionButtonTitle={T.modalDeleteConfirm[locale]}
        onAction={handleDeleteConfirm}
      />

      <Modal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title={isEditing ? T.modalEditTitle[locale] : T.modalSaveTitle[locale]}
        actionButtonTitle={T.modalSaveConfirm[locale]}
        onAction={handleSubmitChecklist}
      />

      <Button
        size="small"
        appearance="transparent"
        className={styles.btnTitle}
        icon={<ArrowLeftRegular />}
        // onClick={handleGoBack}
      >
        {isEditing ? T.pageEditTitle[locale] : T.pageCreateTitle[locale]}
      </Button>

      {!isEditing && (
        <Button
          appearance="primary"
          className={styles.btnAdd}
          icon={<Add16Filled />}
          onClick={handleOpenChecklistForm}
          disabled={isFormOpen}
        >
          {T.btnCreateChecklist[locale]}
        </Button>
      )}

      <Accordion collapsible multiple className={styles.accordion} onToggle={handleToggle} openItems={openItem}>
        {isFormOpen && (
          <AccordionItem className={styles.accordionItem} value={1}>
            <AccordionHeader
              className={styles.accordionHeader}
              expandIcon={
                openItem.includes(1) ? (
                  <TriangleDownFilled style={iconStyle} />
                ) : (
                  <TriangleRightFilled style={iconStyle} />
                )
              }
            >
              {isEditing ? checklistName : T.formCreatingTitle[locale]}
            </AccordionHeader>
            <AccordionPanel className={styles.accordionPanel}>
              <Dropdown
                size="large"
                placeholder={T.docTypePlaceholder[locale]}
                selectedOptions={docType ? [docType] : []}
                value={docType}
                onOptionSelect={(_, data) => setDocType(data.optionValue ?? "")}
                listbox={{ className: styles.dropdownList }}
              >
                {ALL_CONTRACT_TYPES.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Dropdown>

              <Dropdown
                size="large"
                placeholder={T.partyPlaceholder[locale]}
                selectedOptions={party ? [party] : []}
                value={party}
                onOptionSelect={(_, data) => setParty(data.optionValue ?? "")}
                listbox={{ className: styles.dropdownList }}
              >
                {ALL_PARTIES.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Dropdown>

              <Field validationState={validationName ? "error" : "none"} validationMessage={validationName}>
                <Input
                  size="large"
                  placeholder={T.checklistNamePlaceholder[locale]}
                  value={checklistName}
                  onChange={(_, data) => setChecklistName(sanitizeFieldValue(data.value))}
                  required
                />
              </Field>

              <ChecklistForm
                key={checkList.editingChecklistId ?? "new"}
                initialRules={checklistRules}
                onRulesChange={(rules) => setChecklistRules(rules)}
              />
            </AccordionPanel>

            <Button
              icon={<Save16Regular />}
              appearance="primary"
              size="small"
              onClick={() => setIsSaveModalOpen(true)}
              className={styles.btnSaveChecklist}
              // disabled={!checkList.canSave}
            />
          </AccordionItem>
        )}

        {checkList.hasChecklists && (
          <AccordionItem className={styles.accordionItem} value={2}>
            <AccordionHeader
              className={styles.accordionHeader}
              expandIcon={
                openItem.includes(2) ? (
                  <TriangleDownFilled style={iconStyle} />
                ) : (
                  <TriangleRightFilled style={iconStyle} />
                )
              }
            >
              {T.listTitle[locale]}
            </AccordionHeader>
            <AccordionPanel className={styles.accordionPanel}>
              {checkList.checklists.map((item) => (
                <ChecklistCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  createdAt={item.created_at}
                  selected={selectedChecklist === item.id}
                  onSelect={setSelectedChecklist}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default observer(Checklist);
