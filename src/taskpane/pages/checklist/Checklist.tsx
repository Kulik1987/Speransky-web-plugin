import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { useStores } from "../../store";
import { useChecklistStyles } from "./styles";
import { useCommonStyles } from "../../theme/commonStyles";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Field,
  Input,
  mergeClasses,
  Spinner,
} from "@fluentui/react-components";
import type { AccordionToggleData, AccordionToggleEvent } from "@fluentui/react-components";
import {
  Add16Filled,
  ArrowLeft16Regular,
  Dismiss16Regular,
  Save16Regular,
  TriangleDownFilled,
  TriangleRightFilled,
} from "@fluentui/react-icons";
import { getContractTypesForParty, getPartiesForContractType } from "../../constants";
import { ChecklistCard, ComboboxField } from "../../components/molecules";
import { ChecklistForm } from "../../components/organisms";
import { DraftRule } from "../../store/checklist";
import { IconButton, Modal, SearchBox } from "../../components/atoms";
import { getMaxLengthError, normalizeFieldValue, sanitizeFieldValue } from "../../helpers";

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
    ru: "Редактирование чек-листа",
    en: "Edit checklist",
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
  listTitle: {
    ru: "Пользовательские чек-листы",
    en: "Custom checklists",
  },
  modalDeleteTitle: {
    ru: "Удалить чек-лист?",
    en: "Delete checklist?",
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
  modalLeaveTitle: {
    ru: "Покинуть страницу?",
    en: "Leave the page?",
  },
  modalLeaveSubtitle: {
    ru: "Несохранённые изменения будут потеряны",
    en: "Unsaved changes will be lost",
  },
  modalLeaveConfirm: {
    ru: "Да",
    en: "Yes",
  },
  requiredField: {
    ru: "Обязательное поле",
    en: "Required field",
  },
  searchChecklistPlaceholder: {
    ru: "Найти по названию",
    en: "Search by name",
  },
};

const iconStyle = { width: "12px", height: "12px", padding: "5px" };

const Checklist = () => {
  const { menuStore, checkList } = useStores();
  const { locale } = menuStore;
  const navigate = useNavigate();
  const commonStyles = useCommonStyles();
  const styles = useChecklistStyles();

  const isEditing = !!checkList.editingChecklistId;

  const [party, setParty] = useState("");
  const [docType, setDocType] = useState("");
  const [checklistName, setChecklistName] = useState("");
  const [checklistRules, setChecklistRules] = useState<DraftRule[]>([]);
  const [deletedRuleIds, setDeletedRuleIds] = useState<string[]>([]);

  const [checklistSearch, setChecklistSearch] = useState("");

  const [checklistNameTouched, setChecklistNameTouched] = useState(false);
  const [isChecklistNameManual, setIsChecklistNameManual] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  useEffect(() => {
    checkList.setIsFormOpen(isFormOpen);
  }, [isFormOpen]);

  const [openItem, setOpenItems] = useState<number[]>([]);

  const handleToggle = useCallback((_: AccordionToggleEvent, data: AccordionToggleData<number>) => {
    const value = data.value;
    setOpenItems((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }, []);

  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [isChecklistPage, setIsChecklistPage] = useState(false);

  useEffect(() => {
    checkList.getChecklists();
    return () => {
      checkList.setEditingChecklistId(null);
    };
  }, []);

  useEffect(() => {
    if (!isChecklistNameManual) {
      setChecklistName([docType, party].filter(Boolean).join(" - "));
    }
  }, [docType, party, checkList.editingChecklistId]);

  useEffect(() => {
    const id = checkList.editingChecklistId;
    if (!id) return;

    setIsFormOpen(false);
    setChecklistRules([]);
    setDeletedRuleIds([]);

    checkList.getChecklistById(id).then((data) => {
      if (!data) return;
      setDocType(data.doc_type ?? "");
      setParty(data.party || T.allPartiesValue[locale]);
      setChecklistName(data.name);
      setIsChecklistNameManual(true);
      setChecklistRules([...checkList.checklistRules]);
      setIsFormOpen(true);
      setOpenItems([1]);
    });
  }, [checkList.editingChecklistId]);

  const resetForm = () => {
    setIsFormOpen(false);
    setChecklistName("");
    setChecklistNameTouched(false);
    setIsChecklistNameManual(false);
    setDocType("");
    setParty("");
    setChecklistRules([]);
    setDeletedRuleIds([]);
  };

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
      checklistRules,
      deletedRuleIds
    );
    if (success) {
      resetForm();
      setOpenItems([2]);
    }
  };

  const handleEdit = (id: string) => {
    setIsChecklistPage(true);
    checkList.setEditingChecklistId(id);
  };

  const handleDuplicate = async (id: string) => {
    await checkList.duplicateChecklist(id);
  };

  const handleDelete = (id: string) => setTargetId(id);
  const handleDeleteConfirm = async () => {
    const wasEditing = targetId === checkList.editingChecklistId;
    await checkList.deleteChecklist(targetId);
    setTargetId(null);
    if (wasEditing) {
      resetForm();
      setIsChecklistPage(false);
    }
  };

  const executeGoBack = () => {
    if (isEditing && isChecklistPage) {
      checkList.setEditingChecklistId(null);
      setIsChecklistPage(false);
      resetForm();
      setOpenItems([2]);
    } else {
      checkList.setEditingChecklistId(null);
      navigate(-1);
    }
  };

  const handleGoBack = () => {
    if (isFormOpen) {
      setIsLeaveModalOpen(true);
    } else {
      executeGoBack();
    }
  };

  const handleGoBackConfirm = () => {
    setIsLeaveModalOpen(false);
    executeGoBack();
  };

  const validationDocType = getMaxLengthError(docType, locale, 255);
  const validationParty = getMaxLengthError(party, locale, 100);
  const validationName =
    checklistNameTouched && !checklistName ? T.requiredField[locale] : getMaxLengthError(checklistName, locale, 255);

  // Возвращает true, если чек-лист готов к сохранению:
  // заполнено название и все правила прошли валидацию обязательных полей
  const canSave =
    !!checklistName &&
    !getMaxLengthError(checklistName, locale, 255) &&
    checklistRules.length !== 0 &&
    checklistRules.every((rule) => {
      const r = rule as {
        simple_rule?: string;
        check_condition?: string;
        risk_triggers?: { risk_trigger: string }[] | null;
      };
      return !!(r.simple_rule || r.check_condition) && !!r.risk_triggers?.length;
    });

  const checklistNameField = (
    <Field validationState={validationName ? "error" : "none"} validationMessage={validationName}>
      <Input
        size="large"
        placeholder={T.checklistNamePlaceholder[locale]}
        value={checklistName}
        onChange={(_, data) => {
          const value = sanitizeFieldValue(data.value, 255);
          setIsChecklistNameManual(!!value);
          setChecklistName(value);
        }}
        onBlur={(e) => {
          setChecklistNameTouched(true);
          setChecklistName(normalizeFieldValue(e.target.value));
        }}
        required
        contentAfter={
          checklistName
            ? {
                children: <Dismiss16Regular />,
                onClick: () => {
                  setIsChecklistNameManual(false);
                  setChecklistName("");
                },
                onMouseDown: (e) => e.preventDefault(),
                className: styles.clearIcon,
              }
            : undefined
        }
        className={mergeClasses(commonStyles.input, checklistName && commonStyles.inputFill)}
      />
    </Field>
  );

  const filteredChecklists = checklistSearch
    ? checkList.checklists.filter((item) => item.name.toLowerCase().includes(checklistSearch.toLowerCase()))
    : checkList.checklists;

  if (checkList.isDraftLoading) return <Spinner />;

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
        children={checklistNameField}
      />

      <Modal
        open={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title={T.modalLeaveTitle[locale]}
        actionButtonTitle={T.modalLeaveConfirm[locale]}
        onAction={handleGoBackConfirm}
        children={<span>{T.modalLeaveSubtitle[locale]}</span>}
        reverseActions
      />

      <div className={styles.blockTitle}>
        <Button
          size="small"
          appearance="subtle"
          className={styles.btnTitle}
          icon={<ArrowLeft16Regular />}
          onClick={handleGoBack}
        >
          {isEditing ? T.pageEditTitle[locale] : T.pageCreateTitle[locale]}
        </Button>

        {!isFormOpen && (
          <IconButton
            appearance="primary"
            tooltip={T.btnCreateChecklist[locale]}
            icon={<Add16Filled />}
            onClick={handleOpenChecklistForm}
            positioning="above-end"
            disabled={isFormOpen}
          />
        )}
      </div>

      <Accordion collapsible multiple className={commonStyles.accordion} onToggle={handleToggle} openItems={openItem}>
        {isFormOpen && (
          <AccordionItem className={commonStyles.accordionItem} value={1}>
            <AccordionHeader
              className={mergeClasses(commonStyles.accordionHeader, styles.accordionHeader)}
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
            <AccordionPanel className={commonStyles.accordionPanel}>
              <ComboboxField
                value={docType}
                onChange={setDocType}
                options={getContractTypesForParty(party)}
                placeholder={T.docTypePlaceholder[locale]}
                maxLength={255}
                validationMessage={validationDocType}
              />

              <ComboboxField
                value={party}
                onChange={setParty}
                options={getPartiesForContractType(docType)}
                placeholder={T.partyPlaceholder[locale]}
                maxLength={100}
                validationMessage={validationParty}
              />

              {checklistNameField}

              <ChecklistForm
                key={checkList.editingChecklistId ?? "new"}
                initialRules={checklistRules}
                onRulesChange={(rules, deletedIds) => {
                  setChecklistRules(rules);
                  setDeletedRuleIds(deletedIds);
                }}
              />
            </AccordionPanel>

            <IconButton
              tooltip={T.modalSaveConfirm[locale]}
              icon={<Save16Regular />}
              onClick={() => setIsSaveModalOpen(true)}
              positioning="above-end"
              appearance="primary"
              className={commonStyles.accordionActions}
              disabled={!canSave}
            />
          </AccordionItem>
        )}

        {checkList.hasChecklists && (
          <AccordionItem className={commonStyles.accordionItem} value={2}>
            <AccordionHeader
              className={mergeClasses(commonStyles.accordionHeader, styles.accordionHeader)}
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
            <AccordionPanel className={commonStyles.accordionPanel}>
              <SearchBox
                value={checklistSearch}
                onChange={setChecklistSearch}
                placeholder={T.searchChecklistPlaceholder[locale]}
              />

              {filteredChecklists.map((item) => (
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
