import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Radio,
  RadioGroup,
  mergeClasses,
} from "@fluentui/react-components";
import {
  ArrowLeft16Regular,
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
import { LocaleEnums } from "../../../store/menu";
import { useDrawerModalStyles } from "./styles";
import { RoutePathEnum } from "../../../enums";

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
  const { locale, setLocale } = menuStore;
  const styles = useDrawerModalStyles();
  const navigate = useNavigate();
  const [level, setLevel] = useState<1 | 2>(1);

  const handleClose = () => {
    setLevel(1);
    onClose();
  };

  const handleLogout = () => {
    authStore.logout();
    navigate(RoutePathEnum.ROOT);
    onClose();
  };

  const handleGoToChecklists = () => {
    navigate(RoutePathEnum.CHECKLIST);
    onClose();
  };

  const handleSelectLang = (lang: LocaleEnums) => {
    setLocale(lang);
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
        <DrawerBody className={level === 1 ? styles.body : mergeClasses(styles.body, styles.bodyLevel2)}>
          {level === 1 && (
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
                    onClick={handleGoToChecklists}
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
                    <Button appearance="transparent" className={styles.sectionValue} onClick={() => setLevel(2)}>
                      {T.language[locale]}
                    </Button>
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
          )}

          {level === 2 && (
            <>
              <div className={styles.langHeader}>
                <Button
                  appearance="transparent"
                  aria-label="Back"
                  icon={<ArrowLeft16Regular />}
                  onClick={() => setLevel(1)}
                />
                <span>{T.settingsLang[locale]}</span>
              </div>
              <RadioGroup
                className={styles.langList}
                value={locale}
                onChange={(_, data) => handleSelectLang(data.value as LocaleEnums)}
              >
                <div className={styles.langRadioButton}>
                  <Radio
                    className={styles.langRadio}
                    value={LocaleEnums.RU}
                    label={
                      <div className={styles.langLabel}>
                        <span className={styles.langTitle}>Русский</span>
                        <span className={styles.langSubtitle}>Russian</span>
                      </div>
                    }
                  />
                  <Divider />
                </div>
                <div className={styles.langRadioButton}>
                  <Radio
                    className={styles.langRadio}
                    value={LocaleEnums.EN}
                    label={
                      <div className={styles.langLabel}>
                        <span className={styles.langTitle}>Английский</span>
                        <span className={styles.langSubtitle}>English</span>
                      </div>
                    }
                  />
                  <Divider />
                </div>
              </RadioGroup>
            </>
          )}
        </DrawerBody>
      )}

      <DrawerFooter className={styles.footer}>
        <Button
          appearance="transparent"
          className={mergeClasses(styles.button, styles.logoutButton)}
          onClick={handleLogout}
          icon={<DoorArrowLeft20Regular />}
        >
          {T.btnLogout[locale]}
        </Button>
        <div className={styles.version}>v.{appBuildNumber}</div>
      </DrawerFooter>
    </Drawer>
  );
};

export default observer(DrawerModal);
