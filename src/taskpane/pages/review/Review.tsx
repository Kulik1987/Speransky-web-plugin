import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Divider, Text } from "@fluentui/react-components";
import { useStores } from "../../store";
import { ReviewTypeGeneral } from "./reviewTypeGeneral";
import { ReviewTypeCustom } from "./reviewTypeCustom";
import { Anonymizer } from "./anonymizer";
import { PlayBook } from "./playBook";
import { ItemSkeleton } from "../../components/molecules";
import { useReviewStyles } from "./styles";
import { useNavigate } from "react-router-dom";

const APP_SET_ANONYMIZER = process.env.APP_SET_ANONYMIZER;

const T = {
  waitingNotification: {
    ru: "Идёт анализ сторон",
    en: "Please await",
  },
  dividerSelectReviewType: {
    ru: "Выберите тип проверки",
    en: "Select a review",
  },
  dividerPlaybooks: {
    ru: "Чек-листы",
    en: "Playbooks",
  },
  dividerAnonymizer: {
    ru: "Анонимайзер",
    en: "Anonymizer",
  },
  buttonAnonymizer: {
    ru: "Добавить",
    en: "Add",
  },
};

const Review = () => {
  const { menuStore, documentStore, suggestionsStore } = useStores();
  const { locale } = menuStore;
  const { parties, partiesError, isPartiesProcessing } = suggestionsStore;
  const isError = Boolean(partiesError);
  const navigate = useNavigate();
  const styles = useReviewStyles();

  useEffect(() => {
    console.log("navigate to [page review]");

    const loadParties = async () => {
      if (!documentStore.documentId) {
        navigate("/");
        return;
      }

      if (!parties && !isPartiesProcessing) {
        await suggestionsStore.requestParties(documentStore.documentId);
      }
    };

    loadParties();
  }, []);

  const isDisplayAnonymizer = APP_SET_ANONYMIZER === "true";

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Divider alignContent="center" inset>
          <Text size={300} weight="medium">
            {isPartiesProcessing ? T.waitingNotification[locale] : T.dividerSelectReviewType[locale]}
          </Text>
        </Divider>
        {isPartiesProcessing ? (
          <ItemSkeleton />
        ) : (
          <>
            <ReviewTypeGeneral />
            <ReviewTypeCustom />
          </>
        )}
      </div>

      {!isPartiesProcessing && (
        <>
          <div className={styles.block}>
            <Divider alignContent="center" inset>
              <Text size={300} weight="medium">
                {T.dividerPlaybooks[locale]}
              </Text>
            </Divider>
            <PlayBook />
          </div>

          {isDisplayAnonymizer && (
            <div className={styles.block}>
              <Divider alignContent="center" inset>
                <Text size={300} weight="medium">
                  {T.dividerAnonymizer[locale]}
                </Text>
              </Divider>
              <Anonymizer />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default observer(Review);
