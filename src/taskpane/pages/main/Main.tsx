import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { DraftsRegular, TextBulletListSquareSearchRegular } from "@fluentui/react-icons";
import { Button, Divider, makeStyles, shorthands, Text, tokens } from "@fluentui/react-components";
import {
  SelectionLang,
  // SelectionModelAi
} from "../../components/widgets";
import { useStores } from "../../store";
import { useMainStyles } from "./styles";

const T = {
  actionsLabel: {
    ru: "Выберите действие",
    en: "Select an action",
  },
  btnDraft: {
    ru: "Написание",
    en: "Draft",
  },
  btnReview: {
    ru: "Проверка",
    en: "Review",
  },
  dividerLang: {
    ru: "Язык интерфейса",
    en: "Interface language",
  },
};

const Main = () => {
  const { menuStore, documentStore } = useStores();
  const { locale } = menuStore;
  const navigate = useNavigate();
  const styles = useMainStyles();

  const handleNavigateToDraft = () => navigate("./draft");
  const handleNavigateToReview = async () => navigate("./review");

  useEffect(() => {
    if (documentStore.textContractSource === null) {
      //TODO Тут надо решить в какой момент:
      //TODO - обновлять контракт в сторе
      //TODO - повторно запрашивать Стороны
      // а пока контракт обновляется единожды при старте приложения
      documentStore.copyTextContractToStore();
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <Divider alignContent="center" inset className={styles.divider}>
          <Text size={300} weight="medium">
            {T.actionsLabel[locale]}
          </Text>
        </Divider>

        <Button
          className={styles.buttonFull}
          appearance="primary"
          size="large"
          onClick={handleNavigateToReview}
          icon={<TextBulletListSquareSearchRegular />}
        >
          {T.btnReview[locale]}
        </Button>

        <Button
          className={styles.buttonFull}
          appearance="primary"
          size="large"
          onClick={handleNavigateToDraft}
          icon={<DraftsRegular color="#fff" />}
          disabled
        >
          {T.btnDraft[locale]}
        </Button>
      </div>

      <div className={styles.section}>
        <SelectionLang />
        {/* <SelectionModelAi /> */}
      </div>
    </div>
  );
};

export default observer(Main);
