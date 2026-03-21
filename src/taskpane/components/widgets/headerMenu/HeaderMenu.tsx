import React, { useState } from "react";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { NavigationFilled } from "@fluentui/react-icons";
import { DrawerModal } from "../../organisms";
import { mergeClasses } from "@fluentui/react-components";
import { useHeaderMenuStyles } from "./styles";
import { IconButton } from "../../atoms";
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
  const [logoLoaded, setLogoLoaded] = useState(false);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <DrawerModal isOpen={isOpen} onClose={handleCloseModal} />

      <div className={styles.container}>
        <IconButton
          tooltip={T.tooltipMenu[locale]}
          icon={<NavigationFilled color="#0F565E" />}
          onClick={handleOpenModal}
          positioning="below-end"
        />

        <img
          alt="logo"
          src={logoSperansky}
          width="32px"
          height="32px"
          onLoad={() => setLogoLoaded(true)}
          className={mergeClasses(logoLoaded ? styles.logoVisible : styles.logoHidden)}
        />
      </div>
    </>
  );
};

export default observer(HeaderMenu);
