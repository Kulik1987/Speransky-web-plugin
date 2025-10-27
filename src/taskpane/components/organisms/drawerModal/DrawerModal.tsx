import React from "react";
import { observer } from "mobx-react";
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle } from "@fluentui/react-components";
import { Dismiss24Regular, TextBulletListSquareSearchRegular } from "@fluentui/react-icons";
import { useStores } from "../../../store";
import { AuthStepperEnum } from "../../../store/auth";
import {
  SelectionLang,
  // SelectionModelAi
} from "../../widgets";

type DrawerModalT = {
  isOpen: boolean;
  onClose: () => void;
};

const T = {
  title: {
    ru: "Настройки",
    en: "Settings",
  },
  dividerLang: {
    ru: "Язык интерфейса",
    en: "Interface language",
  },
  btnLogout: {
    ru: "Выйти",
    en: "Logout",
  },
};

const appBuildNumber = process.env.appBuildNumber;

const DrawerModal = (props: DrawerModalT) => {
  const { isOpen, onClose } = props;
  const { menuStore, authStore } = useStores();
  const { locale } = menuStore;

  const handleClose = () => {
    onClose();
  };
  const handleLogout = () => {
    authStore.logout();
    onClose();
  };

  const isDisplayButtonLogout =
    authStore.authStatus === AuthStepperEnum.ACCESSED || authStore.authStatus === AuthStepperEnum.FORBIDDEN;

  return (
    <Drawer separator open={isOpen} onOpenChange={() => onClose()}>
      <DrawerHeader>
        <DrawerHeaderTitle
          action={<Button appearance="subtle" aria-label="Close" icon={<Dismiss24Regular />} onClick={handleClose} />}
        >
          {T.title[locale]}
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          justifyContent: "space-between",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "36px", flexDirection: "column" }}>
          <SelectionLang />
          {/* <SelectionModelAi /> */}
        </div>
        <div>
          <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
            {isDisplayButtonLogout && (
              <Button
                appearance="outline"
                onClick={handleLogout}
                style={{ borderColor: "#ce860f", color: "#ce860f" }}
                icon={<TextBulletListSquareSearchRegular style={{ color: "#ce860f" }} />}
                color="red"
              >
                {T.btnLogout[locale]}
              </Button>
            )}
          </div>
          <div style={{ display: "flex", paddingTop: "12px", color: "#B7B7B7" }}>v.{appBuildNumber}</div>
        </div>
      </DrawerBody>
    </Drawer>
  );
};

export default observer(DrawerModal);
