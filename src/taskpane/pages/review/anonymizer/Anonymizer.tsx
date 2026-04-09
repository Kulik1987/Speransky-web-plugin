import React from "react";
import { observer } from "mobx-react";
import { Button, Text } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { DocumentLockRegular } from "@fluentui/react-icons";
import { useAnonymizerStyles } from "./styles";

const T = {
  description: {
    ru: "Добавить в конец документа текст договора с удаленными персональными данными",
    en: "Appends a copy of the contract with personal data replaced to the end of the document",
  },
  button: {
    ru: "Добавить анонимную копию",
    en: "Add anonymous copy",
  },
};

const Anonymizer = () => {
  const { menuStore, documentStore } = useStores();
  const { locale } = menuStore;
  const styles = useAnonymizerStyles();

  const handleAddAnonymizedText = async () => {
    const { textContractAnonymized } = documentStore;
    if (typeof textContractAnonymized !== "string") return null;
    await Word.run(async (context) => {
      const body = context.document.body;
      // Создаем новый Range в конце документа для прокрутки к концу
      const range = body.getRange("End");
      range.select();

      const sanitizedText = textContractAnonymized.replace(/\v/g, "\r");
      body.insertText(sanitizedText, Word.InsertLocation.end);
      await context.sync();
    }).catch((error) => {
      console.log("Error [handleAddAnonymizedText]: " + error);
    });
  };

  return (
    <div className={styles.container}>
      <Text size={300}>{T.description[locale]}</Text>
      <Button
        appearance="primary"
        size="medium"
        className={styles.button}
        icon={<DocumentLockRegular />}
        onClick={handleAddAnonymizedText}
      >
        {T.button[locale]}
      </Button>
    </div>
  );
};

export default observer(Anonymizer);
