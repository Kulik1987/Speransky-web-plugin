import { mergeClasses, Tab, TabList } from "@fluentui/react-components";
import type { SelectTabData, SelectTabEvent } from "@fluentui/react-components";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useStores } from "../../../store";
import { ReviewTypesEnums, RoutePathEnum } from "../../../enums";
import { useReviewTypeStyles } from "./styles";
import { useLocation, useNavigate } from "react-router-dom";
import { ReviewTypeBase } from "../reviewTypeBase";
import { ChecklistCard, RetryableError } from "../../../components/molecules";
import { SUPPORTED_CONTRACT_TYPES } from "../../../constants";
import { useChecklistCardActions } from "../../../hooks/useChecklistCardActions";

const T = {
  titleGeneral: {
    ru: "Общая",
    en: "General",
  },
  titleCustom: {
    ru: "Индивидуальная",
    en: "Custom",
  },
  loadingTitle: {
    ru: "Определяем тип и стороны договора",
    en: "Determine contract type and parties",
  },
  checklistTypeMismatch: {
    ru: "Чек-лист не соответствует типу",
    en: "The checklist does not match type",
  },
  retry: {
    ru: "Повторить",
    en: "Retry",
  },
  networkErrorSubtitle: {
    ru: "Нет соединения с сервером. Проверьте интернет-соединение или отключите VPN.",
    en: "No connection to the server. Check your internet connection or disable VPN.",
  },
  errorLoadChecklists: {
    ru: "Не удалось загрузить список чек-листов.",
    en: "Failed to load the checklist list.",
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

  const { handleDelete, handleDuplicate, modals: checklistActionModals } = useChecklistCardActions();

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

  const selectedChecklistData = checkList.checklists?.find((item) => item.id === selectedChecklist);
  const isChecklistTypeMismatch =
    selectedTab === ReviewTypesEnums.CUSTOM &&
    !!selectedChecklistData &&
    !!suggestionsStore.documentType &&
    selectedChecklistData.doc_type !== suggestionsStore.documentType;

  const reviewCustomChecklists = checkList.checklistsError ? (
    <RetryableError
      error={
        checkList.checklistsError === "network_error" ? T.networkErrorSubtitle[locale] : T.errorLoadChecklists[locale]
      }
      retryText={T.retry[locale]}
      onRetry={() => checkList.getChecklists()}
    />
  ) : checkList.hasChecklists ? (
    filteredChecklists.map((item) => (
      <ChecklistCard
        key={item.id}
        id={item.id}
        name={item.name}
        createdAt={item.created_at}
        isRadio
        selected={selectedChecklist === item.id}
        searchText={searchQuery}
        onSelect={setSelectedChecklist}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />
    ))
  ) : null;

  return (
    <div className={styles.container}>
      {checklistActionModals}

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
        warningMessage={
          isChecklistTypeMismatch ? `${T.checklistTypeMismatch[locale]} «${suggestionsStore.documentType}»` : undefined
        }
        hideSearch={!!checkList.checklistsError}
      />
    </div>
  );
};

export default observer(ReviewType);
