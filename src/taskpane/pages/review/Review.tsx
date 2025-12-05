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
  const { menuStore, suggestionsStore } = useStores();
  const { locale } = menuStore;
  const { getPartiesProcessing } = suggestionsStore;
  const styles = useReviewStyles();

  useEffect(() => {
    console.log("navigate to [page review]");
  }, []);

  const isDisplayAnonymizer = APP_SET_ANONYMIZER === "true";

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Divider alignContent="center" inset>
          <Text size={300} weight="medium">
            {getPartiesProcessing ? T.waitingNotification[locale] : T.dividerSelectReviewType[locale]}
          </Text>
        </Divider>
        {getPartiesProcessing ? (
          <ItemSkeleton />
        ) : (
          <>
            <ReviewTypeGeneral />
            <ReviewTypeCustom />
          </>
        )}
      </div>

      {!getPartiesProcessing && (
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
