import React, { useState } from "react";
import { Button, Tooltip } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { NavigationRegular } from "@fluentui/react-icons";
import { DrawerModal } from "../../organisms";
import { useHeaderMenuStyles } from "./styles";
const logoSperansky = require("../../../assets/logo-v4.svg");

const T = {
  tooltipMenu: {
    ru: "Меню",
    en: "Menu",
  },
};

const HeaderMenu = () => {
  const { menuStore } = useStores();
  const { locale } = menuStore;
  const styles = useHeaderMenuStyles();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <DrawerModal isOpen={isOpen} onClose={handleCloseModal} />

      <div className={styles.container}>
        <img alt="Speransky logo" src={logoSperansky} width="32px" height="32px" />

        <Tooltip content={T.tooltipMenu[locale]} withArrow relationship="label">
          <Button
            appearance="transparent"
            size="small"
            onClick={handleOpenModal}
            icon={<NavigationRegular color="#FFFFFF" />}
          />
        </Tooltip>
      </div>
    </>
  );
};

export default observer(HeaderMenu);
