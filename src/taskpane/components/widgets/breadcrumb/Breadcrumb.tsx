import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb as BreadcrumbUI,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  mergeClasses,
} from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { LocaleEnums } from "../../../store/menu";
import { ReviewTypesEnums, RoutePathEnum } from "../../../enums";
import { useBreadcrumbStyles } from "./styles";
import { Modal } from "../../atoms";

type RegularStep = {
  label: Record<LocaleEnums, string>;
  path: RoutePathEnum;
  state?: Record<string, unknown>;
};

type EllipsisStep = {
  hidden: RegularStep[];
};

type BreadcrumbStep = RegularStep | EllipsisStep;

const T = {
  mainPage: {
    ru: "Выбрать действие",
    en: "Select action",
  },
  reviewPage: {
    ru: "Проверить договор",
    en: "Review contract",
  },
  reviewTypePage: {
    ru: "Тип проверки",
    en: "Review type",
  },
  draftPage: {
    ru: "Создать договор",
    en: "Create contract",
  },
  checklistPage: {
    ru: "Настроить чек-листы",
    en: "Configure checklists",
  },
  summaryPage: {
    ru: "Рекомендации",
    en: "Recommendations",
  },
  modalTitle: {
    ru: "Покинуть страницу?",
    en: "Leave the page?",
  },
  modalSubtitle: {
    ru: "Рекомендации будут потеряны",
    en: "Recommendations will be lost",
  },
  modalConfirm: {
    ru: "Да",
    en: "Yes",
  },
  reviewTypeGeneral: {
    ru: "Общая",
    en: "General",
  },
  reviewTypeCustom: {
    ru: "Индивидуальная",
    en: "Custom",
  },
};

const MAIN_STEP: RegularStep = { label: T.mainPage, path: RoutePathEnum.ROOT };
const DRAFT_STEP: RegularStep = { label: T.draftPage, path: RoutePathEnum.DRAFT };
const REVIEW_STEP: RegularStep = { label: T.reviewPage, path: RoutePathEnum.REVIEW };
const REVIEW_TYPE_STEP: RegularStep = { label: T.reviewTypePage, path: RoutePathEnum.REVIEW_TYPE };
const CHECKLIST_STEP: RegularStep = { label: T.checklistPage, path: RoutePathEnum.CHECKLIST };
const SUMMARY_STEP: RegularStep = { label: T.summaryPage, path: RoutePathEnum.SUMMARY };

const BREADCRUMB_CONFIG: Partial<Record<RoutePathEnum, BreadcrumbStep[]>> = {
  [RoutePathEnum.DRAFT]: [MAIN_STEP, DRAFT_STEP],
  [RoutePathEnum.REVIEW]: [MAIN_STEP, REVIEW_STEP],
  [RoutePathEnum.REVIEW_TYPE]: [MAIN_STEP, REVIEW_STEP, REVIEW_TYPE_STEP],
  [RoutePathEnum.CHECKLIST]: [MAIN_STEP, CHECKLIST_STEP],
};

const Breadcrumb = () => {
  const { menuStore, authStore } = useStores();
  const { locale } = menuStore;
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const styles = useBreadcrumbStyles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingNav, setPendingNav] = useState<{ path: RoutePathEnum; state?: Record<string, unknown> } | null>(null);

  const isSummaryPage = pathname === RoutePathEnum.SUMMARY;

  const handleStepClick = (path: RoutePathEnum, state?: Record<string, unknown>) => {
    if (isSummaryPage) {
      setPendingNav({ path, state });
      setIsModalOpen(true);
    } else {
      navigate(path, { state });
    }
  };

  const handleConfirmLeave = () => {
    setIsModalOpen(false);
    if (pendingNav) {
      navigate(pendingNav.path, { state: pendingNav.state });
      setPendingNav(null);
    }
  };

  const summaryState = location.state as { reviewType?: ReviewTypesEnums } | null;

  const steps: BreadcrumbStep[] | undefined =
    pathname === RoutePathEnum.SUMMARY
      ? [
          MAIN_STEP,
          { hidden: [REVIEW_STEP] },
          {
            label: summaryState?.reviewType === ReviewTypesEnums.CUSTOM ? T.reviewTypeCustom : T.reviewTypeGeneral,
            path: RoutePathEnum.REVIEW_TYPE,
            state: { tab: summaryState?.reviewType ?? ReviewTypesEnums.GENERAL },
          },
          SUMMARY_STEP,
        ]
      : BREADCRUMB_CONFIG[pathname as RoutePathEnum];

  if (!steps || !authStore.isClientVerify) return null;

  return (
    <>
      <BreadcrumbUI aria-label="breadcrumb navigation" size="small" className={styles.breadcrumb}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbDivider className={styles.divider} />}
            <BreadcrumbItem>
              {"hidden" in step ? (
                <Menu>
                  <MenuTrigger>
                    <BreadcrumbButton className={mergeClasses(styles.button, styles.default)}>…</BreadcrumbButton>
                  </MenuTrigger>
                  <MenuPopover className={styles.ellipsisPopover}>
                    <MenuList>
                      {step.hidden.map((hiddenStep) => (
                        <MenuItem
                          key={hiddenStep.path}
                          className={styles.ellipsisMenuItem}
                          onClick={() => handleStepClick(hiddenStep.path, hiddenStep.state)}
                        >
                          {hiddenStep.label[locale]}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </MenuPopover>
                </Menu>
              ) : (
                <BreadcrumbButton
                  current={index === steps.length - 1}
                  className={mergeClasses(styles.button, index === steps.length - 1 ? styles.active : styles.default)}
                  onClick={() => handleStepClick(step.path, step.state)}
                >
                  {step.label[locale]}
                </BreadcrumbButton>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbUI>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={T.modalTitle[locale]}
        actionButtonTitle={T.modalConfirm[locale]}
        onAction={handleConfirmLeave}
        children={<span>{T.modalSubtitle[locale]}</span>}
        reverseActions
      />
    </>
  );
};

export default observer(Breadcrumb);
