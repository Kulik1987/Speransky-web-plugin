import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb as BreadcrumbUI,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  mergeClasses,
} from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { LocaleEnums } from "../../../store/menu";
import { RoutePathEnum } from "../../../enums";
import { useBreadcrumbStyles } from "./styles";

interface BreadcrumbStep {
  label: Record<LocaleEnums, string>;
  path: RoutePathEnum;
}

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
};

const MAIN_STEP: BreadcrumbStep = { label: T.mainPage, path: RoutePathEnum.ROOT };
const DRAFT_STEP: BreadcrumbStep = { label: T.draftPage, path: RoutePathEnum.DRAFT };
const REVIEW_STEP: BreadcrumbStep = { label: T.reviewPage, path: RoutePathEnum.REVIEW };
const REVIEW_TYPE_STEP: BreadcrumbStep = { label: T.reviewTypePage, path: RoutePathEnum.REVIEW_TYPE };
const REVIEW_GENERAL_STEP: BreadcrumbStep = { label: T.reviewTypePage, path: RoutePathEnum.REVIEW_GENERAL };
const REVIEW_CUSTOM_STEP: BreadcrumbStep = { label: T.reviewTypePage, path: RoutePathEnum.REVIEW_CUSTOM };

const BREADCRUMB_CONFIG: Partial<Record<RoutePathEnum, BreadcrumbStep[]>> = {
  [RoutePathEnum.DRAFT]: [MAIN_STEP, DRAFT_STEP],
  [RoutePathEnum.REVIEW]: [MAIN_STEP, REVIEW_STEP],
  [RoutePathEnum.REVIEW_TYPE]: [MAIN_STEP, REVIEW_STEP, REVIEW_TYPE_STEP],
  [RoutePathEnum.REVIEW_GENERAL]: [MAIN_STEP, REVIEW_STEP, REVIEW_GENERAL_STEP],
  [RoutePathEnum.REVIEW_CUSTOM]: [MAIN_STEP, REVIEW_STEP, REVIEW_CUSTOM_STEP],
};

const Breadcrumb = () => {
  const { menuStore, authStore } = useStores();
  const { locale } = menuStore;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const styles = useBreadcrumbStyles();

  const steps = BREADCRUMB_CONFIG[pathname as RoutePathEnum];

  if (!steps || !authStore.isClientVerify) return null;

  return (
    <BreadcrumbUI aria-label="breadcrumb navigation" size="small">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.path}>
            {index > 0 && <BreadcrumbDivider className={styles.divider} />}
            <BreadcrumbItem>
              <BreadcrumbButton
                current={isLast}
                className={mergeClasses(styles.button, isLast ? styles.active : styles.default)}
                onClick={() => navigate(step.path)}
              >
                {step.label[locale]}
              </BreadcrumbButton>
            </BreadcrumbItem>
          </React.Fragment>
        );
      })}
    </BreadcrumbUI>
  );
};

export default observer(Breadcrumb);
