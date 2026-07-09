import { mergeClasses, Tab, TabList } from "@fluentui/react-components";
import type { SelectTabData, SelectTabEvent } from "@fluentui/react-components";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useStores } from "../../../store";
import { ReviewTypesEnums, RoutePathEnum } from "../../../enums";
import { useReviewTypeStyles } from "./styles";
import { useLocation, useNavigate } from "react-router-dom";
import { ReviewTypeBase } from "../reviewTypeBase";
import { ChecklistCard } from "../../../components/molecules";
import { Modal } from "../../../components/atoms";
import { SUPPORTED_CONTRACT_TYPES } from "../../../constants";

const T = {
  titleGeneral: {
    ru: "Общая",
    en: "General",
  },
  titleCustom: {
    ru: "Индивидуальная",
    en: "Custom",
  },
  deleteTitle: {
    ru: "Удалить чек-лист?",
    en: "Delete checklist?",
  },
  deleteConfirm: {
    ru: "Удалить",
    en: "Delete",
  },
  loadingTitle: {
    ru: "Определяем тип и стороны договора",
    en: "Determine contract type and parties",
  },
};

const ReviewType = () => {
  const { menuStore, suggestionsStore, checkList } = useStores();
  const { locale } = menuStore;
  const styles = useReviewTypeStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { tab?: ReviewTypesEnums } | null;
  const initialTab = state?.tab || ReviewTypesEnums.GENERAL;
  const [selectedTab, setSelectedTab] = useState<string>(initialTab);

  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);
  const [selectedDocType] = useState<string>(() => {
    const docType = suggestionsStore.documentType;
    return docType && SUPPORTED_CONTRACT_TYPES.includes(docType) ? docType : "";
  });

  const [targetId, setTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkList.getChecklists();
  }, []);

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as string);
    setSearchQuery("");
  };

  const handleStartAnalysis = () => {
    suggestionsStore.setChecklistId(selectedTab === ReviewTypesEnums.CUSTOM ? selectedChecklist : null);
    navigate(RoutePathEnum.SUMMARY, { state: { reviewType: selectedTab } });
  };

  const navigateToChecklistPage = () => {
    navigate(RoutePathEnum.CHECKLIST);
  };

  const handleEdit = (id: string) => {
    checkList.setEditingChecklistId(id);
    navigate(RoutePathEnum.CHECKLIST);
  };

  const handleDuplicate = async (id: string) => {
    await checkList.duplicateChecklist(id);
  };

  const handleDelete = (id: string) => setTargetId(id);
  const handleDeleteConfirm = async () => {
    if (!targetId) return;
    await checkList.deleteChecklist(targetId);
    setTargetId(null);
  };

  const filteredContractTypes = searchQuery
    ? SUPPORTED_CONTRACT_TYPES.filter((item: string) => item.toLowerCase().includes(searchQuery.toLowerCase()))
    : SUPPORTED_CONTRACT_TYPES;

  const reviewGeneralChecklists = (
    <div className={styles.list}>
      {filteredContractTypes.map((item: string) => (
        <div key={item} className={mergeClasses(styles.listItem, selectedDocType === item && styles.itemSelected)}>
          <span className={styles.itemLabel}>{item}</span>
        </div>
      ))}
    </div>
  );

  const filteredChecklists = searchQuery
    ? (checkList.checklists ?? []).filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : checkList.checklists ?? [];

  const reviewCustomChecklists = checkList.hasChecklists
    ? filteredChecklists.map((item) => (
        <ChecklistCard
          key={item.id}
          id={item.id}
          name={item.name}
          createdAt={item.created_at}
          isRadio
          selected={selectedChecklist === item.id}
          onSelect={setSelectedChecklist}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      ))
    : null;

  return (
    <div className={styles.container}>
      <Modal
        open={targetId !== null}
        onClose={() => setTargetId(null)}
        title={T.deleteTitle[locale]}
        actionButtonTitle={T.deleteConfirm[locale]}
        onAction={handleDeleteConfirm}
      />

      <TabList selectedValue={selectedTab} onTabSelect={onTabSelect} className={styles.tablist}>
        <Tab value={ReviewTypesEnums.GENERAL} className={styles.tab}>
          {T.titleGeneral[locale]}
        </Tab>
        <Tab value={ReviewTypesEnums.CUSTOM} className={styles.tab}>
          {T.titleCustom[locale]}
        </Tab>
      </TabList>

      <ReviewTypeBase
        type={selectedTab as ReviewTypesEnums}
        listContent={selectedTab === ReviewTypesEnums.GENERAL ? reviewGeneralChecklists : reviewCustomChecklists}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onStartReview={handleStartAnalysis}
        actionHandleClick={selectedTab === ReviewTypesEnums.CUSTOM ? navigateToChecklistPage : undefined}
      />
    </div>
  );
};

export default observer(ReviewType);
