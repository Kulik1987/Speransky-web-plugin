import React from "react";
import { Button, Popover, PopoverSurface, PopoverTrigger, Text } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { usePopoverStyles } from "./style";

interface PopoverWarningProps {
  trigger: React.ReactElement;
  message: string;
  onConfirm: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const T = {
  buttonYes: {
    ru: "Да",
    en: "Yes",
  },
  buttonNo: {
    ru: "Нет",
    en: "No",
  },
};

const PopoverWarning: React.FC<PopoverWarningProps> = ({ trigger, message, onConfirm, isOpen, setIsOpen }) => {
  const { menuStore } = useStores();
  const { locale } = menuStore;
  const styles = usePopoverStyles();

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={(_, data) => setIsOpen(data.open)} positioning="above-end">
      <PopoverTrigger disableButtonEnhancement>{trigger}</PopoverTrigger>

      <PopoverSurface className={styles.container}>
        <Text className={styles.title}>{message}</Text>

        <div className={styles.block}>
          <Button appearance="secondary" onClick={handleCancel}>
            {T.buttonNo[locale]}
          </Button>
          <Button appearance="primary" onClick={onConfirm}>
            {T.buttonYes[locale]}
          </Button>
        </div>
      </PopoverSurface>
    </Popover>
  );
};

export default observer(PopoverWarning);
