import { Radio, RadioGroup, Spinner, Tab, TabList, mergeClasses } from "@fluentui/react-components";
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
    ru: "Удалить чек-лист",
    en: "Delete checklist",
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
  const [targetId, setTargetId] = useState<string | null>(null);

  useEffect(() => {
    checkList.getChecklists();
  }, []);

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as string);
  };

  const handleStartAnalysis = () => {
    suggestionsStore.setChecklistId(selectedTab === ReviewTypesEnums.CUSTOM ? selectedChecklist : null);
    navigate("/summary");
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
    await checkList.deleteChecklist(targetId);
    setTargetId(null);
  };

  const reviewGeneralChecklists = (
    <RadioGroup className={styles.radioGroup}>
      {SUPPORTED_CONTRACT_TYPES.map((item: string) => (
        <Radio
          key={item}
          root={{ className: styles.radioItem }}
          label={{ className: styles.radioItemLabel, children: item }}
          value={item}
        />
      ))}
    </RadioGroup>
  );

  const reviewCustomChecklists = checkList.hasChecklists
    ? checkList.checklists.map((item) => (
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

  if (suggestionsStore.isMetaDataProcessing) return <Spinner size="tiny" label={T.loadingTitle[locale]} />;

  return (
    <div className={styles.container}>
      <Modal
        open={targetId !== null}
        onClose={() => setTargetId(null)}
        title={T.deleteTitle[locale]}
        actionButtonTitle={T.deleteConfirm[locale]}
        onAction={handleDeleteConfirm}
      />

      <TabList selectedValue={selectedTab} onTabSelect={onTabSelect} appearance="subtle" className={styles.tablist}>
        <Tab value={ReviewTypesEnums.GENERAL} className={mergeClasses(styles.tab, styles.tabFirst)}>
          {T.titleGeneral[locale]}
        </Tab>
        <Tab value={ReviewTypesEnums.CUSTOM} className={mergeClasses(styles.tab, styles.tabLast)}>
          {T.titleCustom[locale]}
        </Tab>
      </TabList>

      {selectedTab === ReviewTypesEnums.GENERAL ? (
        <ReviewTypeBase listContent={reviewGeneralChecklists} onStartReview={handleStartAnalysis} />
      ) : (
        <ReviewTypeBase
          listContent={reviewCustomChecklists}
          onStartReview={handleStartAnalysis}
          actionHandleClick={navigateToChecklistPage}
        />
      )}
    </div>
  );
};

export default observer(ReviewType);
