import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Text, Tooltip } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { ArrowLeftRegular, ListRtlRegular } from "@fluentui/react-icons";
import { RoutePathEnum } from "../../../app/navigation/Navigation";
import { DrawerModal } from "../../organisms";
import { AuthStepperEnum } from "../../../store/auth";
import { PopoverWarning } from "../../molecules";
import { useHeaderMenuStyles } from "./styles";

const T = {
  tooltipBack: {
    ru: "Назад",
    en: "Back",
  },
  tooltipMenu: {
    ru: "Меню",
    en: "Menu",
  },
  draft: {
    ru: "Написание",
    en: "Draft",
  },
  review: {
    ru: "Проверка",
    en: "Review",
  },
  summary: {
    ru: "Рекомендации",
    en: "Recommendation",
  },
  default: {
    ru: "Сперанский",
    en: "Speransky",
  },
  popoverMessage: {
    ru: "Рекомендации будут потеряны.\n Уйти со страницы?",
    en: "Recommendations will be lost.\n Leave the page?",
  },
};

const HeaderMenu = () => {
  const { menuStore, authStore } = useStores();
  const { locale } = menuStore;
  const styles = useHeaderMenuStyles();

  const location = useLocation();
  const { pathname } = location;

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isSummaryPage = location.pathname === "/summary";

  const isAuthorizationSteps = authStore.authStatus !== AuthStepperEnum.ACCESSED;
  const isDisableGoBack = isAuthorizationSteps
    ? authStore.authStatus === AuthStepperEnum.EMAIL
    : location.pathname === "/";

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const handleClickBack = () => {
    if (isAuthorizationSteps) {
      if (authStore.authStatus === AuthStepperEnum.FORBIDDEN) {
        authStore.logout();
      }
      authStore.setAuthStatus(AuthStepperEnum.EMAIL);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmLeave = () => {
    setIsPopoverOpen(false);
    navigate(-1);
  };

  const title = ((path) => {
    switch (path) {
      case RoutePathEnum.DRAFT:
        return T.draft[locale];
      case RoutePathEnum.REVIEW:
        return T.review[locale];
      case RoutePathEnum.SUMMARY:
        return T.summary[locale];
      default:
        return T.default[locale];
    }
  })(pathname);

  return (
    <>
      <DrawerModal isOpen={isOpen} onClose={handleCloseModal} />

      <div className={styles.container}>
        {isSummaryPage ? (
          <PopoverWarning
            message={T.popoverMessage[locale]}
            trigger={
              <Button appearance="transparent" size="large" disabled={isDisableGoBack} icon={<ArrowLeftRegular />} />
            }
            isOpen={isPopoverOpen}
            setIsOpen={setIsPopoverOpen}
            onConfirm={handleConfirmLeave}
          />
        ) : (
          <Tooltip content={T.tooltipBack[locale]} withArrow relationship="label">
            <Button
              appearance="transparent"
              size="large"
              onClick={handleClickBack}
              disabled={isDisableGoBack}
              icon={<ArrowLeftRegular />}
            />
          </Tooltip>
        )}

        <div className={styles.block}>
          <Text as="h1" weight="bold" size={400}>
            {title?.toLocaleUpperCase() ?? title}
          </Text>
        </div>

        <Tooltip content={T.tooltipMenu[locale]} withArrow relationship="label">
          <Button
            appearance="transparent"
            size="large"
            onClick={handleOpenModal}
            icon={<ListRtlRegular style={{ transform: "rotate(360deg)" }} />}
          />
        </Tooltip>
      </div>
    </>
  );
};

export default observer(HeaderMenu);
