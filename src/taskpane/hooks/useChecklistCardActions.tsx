import React, { useState } from "react";
import { useStores } from "../store";
import { Modal } from "../components/atoms";

const T = {
  modalDeleteTitle: {
    ru: "Удалить чек-лист?",
    en: "Delete checklist?",
  },
  modalDeleteConfirm: {
    ru: "Удалить",
    en: "Delete",
  },
  modalDeleteBlockedTitle: {
    ru: "Не удалось удалить чек-лист",
    en: "Failed to delete checklist",
  },
  modalDeleteBlockedSubtitle: {
    ru: "Чек-лист используется в запущенном анализе. Дождитесь его завершения.",
    en: "The checklist is being used in a running analysis. Please wait for it to finish.",
  },
  modalDuplicateErrorTitle: {
    ru: "Не удалось скопировать чек-лист",
    en: "Failed to duplicate the checklist",
  },
  networkErrorSubtitle: {
    ru: "Нет соединения с сервером. Проверьте интернет-соединение или отключите VPN.",
    en: "No connection to the server. Check your internet connection or disable VPN.",
  },
  retry: {
    ru: "Повторить",
    en: "Retry",
  },
};

type UseChecklistCardActionsOptions = {
  onDeleteSuccess?: (id: string) => void;
};

/**
 * @description Общая логика удаления и дублирования чек-листа из карточки списка:
 * состояние подтверждения/ошибок, повтор при сбое и сами диалоговые окна.
 * Используется страницами Checklist и ReviewType, у которых разная обвязка списка,
 * но одинаковое поведение удаления/дублирования.
 */
export const useChecklistCardActions = (options?: UseChecklistCardActionsOptions) => {
  const { menuStore, checkList } = useStores();
  const { locale } = menuStore;

  const [targetId, setTargetId] = useState<string | null>(null);
  const [deleteBlocked, setDeleteBlocked] = useState<{ id: string; reason: "in_use" | "error" } | null>(null);
  const [duplicateError, setDuplicateError] = useState<{ id: string; reason: "network_error" | "error" } | null>(null);

  const attemptDelete = async (id: string) => {
    const result = await checkList.deleteChecklist(id);
    if (result === "in_use" || result === "error") {
      setDeleteBlocked({ id, reason: result });
      return;
    }
    setDeleteBlocked(null);
    options?.onDeleteSuccess?.(id);
  };

  const handleDelete = (id: string) => setTargetId(id);

  const handleDeleteConfirm = async () => {
    if (!targetId) return;
    const id = targetId;
    setTargetId(null);
    await attemptDelete(id);
  };

  const handleRetryDelete = async () => {
    if (!deleteBlocked) return;
    await attemptDelete(deleteBlocked.id);
  };

  const handleDuplicate = async (id: string) => {
    setDuplicateError(null);
    const result = await checkList.duplicateChecklist(id);
    if (result !== "success") {
      setDuplicateError({ id, reason: result });
    }
  };

  const handleRetryDuplicate = async () => {
    if (!duplicateError) return;
    await handleDuplicate(duplicateError.id);
  };

  const modals = (
    <>
      <Modal
        open={targetId !== null}
        onClose={() => setTargetId(null)}
        title={T.modalDeleteTitle[locale]}
        actionButtonTitle={T.modalDeleteConfirm[locale]}
        onAction={handleDeleteConfirm}
      />

      <Modal
        open={deleteBlocked !== null}
        onClose={() => setDeleteBlocked(null)}
        title={T.modalDeleteBlockedTitle[locale]}
        actionButtonTitle={T.retry[locale]}
        onAction={handleRetryDelete}
        children={deleteBlocked?.reason === "in_use" ? <span>{T.modalDeleteBlockedSubtitle[locale]}</span> : undefined}
      />

      <Modal
        open={duplicateError !== null}
        onClose={() => setDuplicateError(null)}
        title={T.modalDuplicateErrorTitle[locale]}
        actionButtonTitle={T.retry[locale]}
        onAction={handleRetryDuplicate}
        children={
          duplicateError?.reason === "network_error" ? <span>{T.networkErrorSubtitle[locale]}</span> : undefined
        }
      />
    </>
  );

  return { handleDelete, handleDuplicate, modals };
};
