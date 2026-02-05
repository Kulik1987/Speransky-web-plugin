import React from "react";
import { observer } from "mobx-react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  mergeClasses,
} from "@fluentui/react-components";
import {
  Chat20Regular,
  Dismiss24Regular,
  DocumentTableCheckmark20Regular,
  DoorArrowLeft20Regular,
  FolderPeople20Regular,
  Globe20Regular,
  MailCopy20Regular,
} from "@fluentui/react-icons";
import { useStores } from "../../../store";
import { AuthStepperEnum } from "../../../store/auth";
import { useDrawerModalStyles } from "./styles";

type DrawerModalT = {
  isOpen: boolean;
  onClose: () => void;
};

const T = {
  account: {
    ru: "Профиль",
    en: "Account",
  },
  tariff: {
    ru: "Тарифный план",
    en: "Current tariff",
  },
  quickAccess: {
    ru: "Быстрый доступ",
    en: "Quick access",
  },
  checklists: {
    ru: "Чек-листы",
    en: "Checklists",
  },
  settings: {
    ru: "Настройки",
    en: "Settings",
  },
  settingsLang: {
    ru: "Язык интерфейса",
    en: "Interface language",
  },
  language: {
    ru: "Русский",
    en: "English",
  },
  settingsChat: {
    ru: "Открыть AI чат",
    en: "Open AI chat",
  },
  btnLogout: {
    ru: "Выход из аккаунта",
    en: "Logout",
  },
};

const appBuildNumber = process.env.appBuildNumber;

const DrawerModal = (props: DrawerModalT) => {
  const { isOpen, onClose } = props;
  const { menuStore, authStore } = useStores();
  const { locale } = menuStore;
  const styles = useDrawerModalStyles();

  const handleClose = () => {
    onClose();
  };
  const handleLogout = () => {
    authStore.logout();
    onClose();
  };

  const isAuthorized = authStore.authStatus === AuthStepperEnum.ACCESSED;

  const isDisplayButtonLogout = isAuthorized || authStore.authStatus === AuthStepperEnum.FORBIDDEN;

  return (
    <Drawer className={styles.container} separator open={isOpen} onOpenChange={() => onClose()}>
      <DrawerHeader className={styles.header}>
        <DrawerHeaderTitle
          action={<Button appearance="subtle" aria-label="Close" icon={<Dismiss24Regular />} onClick={handleClose} />}
        />
      </DrawerHeader>

      {isAuthorized && (
        <DrawerBody className={styles.body}>
          <div className={styles.sections}>
            <div>
              <div className={styles.sectionHeader}>{T.account[locale]}</div>
              <div className={styles.sectionContent}>
                <div>
                  <MailCopy20Regular /> {authStore.clientEmail}
                </div>
              </div>
            </div>

            <div>
              <div className={styles.sectionHeader}>{T.tariff[locale]}</div>
              <div className={styles.sectionContent}>
                <div>
                  <FolderPeople20Regular />
                  {authStore.clientData?.active_tariffs[0].name || "Speransky Corp"}
                </div>
              </div>
            </div>

            <div>
              <div className={styles.sectionHeader}>{T.quickAccess[locale]}</div>
              <div className={styles.sectionContent}>
                <Button
                  appearance="transparent"
                  className={mergeClasses(styles.button, styles.sectionButton)}
                  icon={<DocumentTableCheckmark20Regular />}
                  disabled
                >
                  {T.checklists[locale]}
                </Button>
              </div>
            </div>

            <div>
              <div className={styles.sectionHeader}>{T.settings[locale]}</div>
              <div className={styles.sectionContent}>
                <div>
                  <Globe20Regular /> {T.settingsLang[locale]}
                  <span className={styles.sectionValue}>{T.language[locale]}</span>
                </div>
                <Button
                  appearance="transparent"
                  className={mergeClasses(styles.button, styles.sectionButton)}
                  icon={<Chat20Regular />}
                  disabled
                >
                  {T.settingsChat[locale]}
                </Button>
              </div>
            </div>
          </div>

          {isDisplayButtonLogout && (
            <Button
              appearance="transparent"
              className={mergeClasses(styles.button, styles.logoutButton)}
              onClick={handleLogout}
              icon={<DoorArrowLeft20Regular />}
            >
              {T.btnLogout[locale]}
            </Button>
          )}
        </DrawerBody>
      )}

      <DrawerFooter className={styles.version}>v.{appBuildNumber}</DrawerFooter>
    </Drawer>
  );
};

export default observer(DrawerModal);
