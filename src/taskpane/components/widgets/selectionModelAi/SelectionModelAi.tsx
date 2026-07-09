import React from "react";
import { Divider, Text, ToggleButton } from "@fluentui/react-components";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { ProviderLLMEnums } from "../../../enums";
import { useSelectionModelAiStyles } from "./styles";

const T = {
  dividerLang: {
    ru: "LLM модель",
    en: "LLM model",
  },
};

const SelectionModelAi = () => {
  const { menuStore } = useStores();
  const { locale, providerLLM, setProviderLLM } = menuStore;
  const styles = useSelectionModelAiStyles();

  return (
    <div className={styles.container}>
      <Divider alignContent="center" inset>
        <Text size={300} weight="medium">
          {T.dividerLang[locale]}
        </Text>
      </Divider>

      <div className={styles.toggleBtnBlock}>
        <ToggleButton
          checked={providerLLM === ProviderLLMEnums.OPEN_AI}
          onClick={() => setProviderLLM(ProviderLLMEnums.OPEN_AI)}
        >
          Open AI
        </ToggleButton>
        <ToggleButton
          checked={providerLLM === ProviderLLMEnums.GIGA_CHAT}
          onClick={() => setProviderLLM(ProviderLLMEnums.GIGA_CHAT)}
        >
          Giga Chat
        </ToggleButton>
        <ToggleButton
          checked={providerLLM === ProviderLLMEnums.MISTRAL}
          onClick={() => setProviderLLM(ProviderLLMEnums.MISTRAL)}
        >
          Mistral
        </ToggleButton>
      </div>
    </div>
  );
};

export default observer(SelectionModelAi);
