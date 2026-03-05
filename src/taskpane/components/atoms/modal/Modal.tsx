import React, { ReactNode } from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  mergeClasses,
} from "@fluentui/react-components";
import { useStores } from "../../../store";
import { useModalStyles } from "./styles";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  actionButtonTitle: string;
  onAction: () => void;
  children?: ReactNode;
}

const T = {
  cancel: {
    ru: "Отменить",
    en: "Cancel",
  },
};

const Modal = (props: ModalProps) => {
  const { open, onClose, title, actionButtonTitle, onAction, children } = props;
  const { menuStore } = useStores();
  const { locale } = menuStore;
  const styles = useModalStyles();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={mergeClasses(styles.container, children && styles.withContent)}>
        <DialogBody>
          <DialogTitle className={styles.title}>{title}</DialogTitle>
          {children && <DialogContent>{children}</DialogContent>}
          <DialogActions className={styles.actionsBlock}>
            <Button appearance="subtle" onClick={onClose}>
              {T.cancel[locale]}
            </Button>
            <Button appearance="primary" onClick={onAction}>
              {actionButtonTitle}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default Modal;
