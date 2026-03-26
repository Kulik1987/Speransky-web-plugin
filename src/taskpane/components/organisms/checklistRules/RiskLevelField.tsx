import React from "react";
import { Field, Tab, TabList, Textarea } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { RiskLevel } from "../../../api/types";
import { useChecklistRuleStyles } from "./styles";
import { customColors } from "../../../theme/theme";
import { autoResize, getMaxLengthError, normalizeFieldValue, sanitizeFieldValue } from "../../../helpers";

const T = {
  riskLevel: {
    ru: "Степень риска",
    en: "Risk level",
  },
  low: {
    ru: "Низкая",
    en: "Low",
  },
  medium: {
    ru: "Средняя",
    en: "Medium",
  },
  high: {
    ru: "Высокая",
    en: "High",
  },
  riskTriggerPlaceholder: {
    ru: "Какое отклонение от правила определяет данную степень риска?",
    en: "What deviation from the rule determines this risk level?",
  },
};

export type RiskTriggers = Record<RiskLevel, string>;

type RiskLevelFieldProps = {
  riskTriggers: RiskTriggers;
  onTriggerChange: (level: RiskLevel, value: string) => void;
  onTriggerBlur: (level: RiskLevel, value: string) => void;
};

const RiskLevelField = ({ riskTriggers, onTriggerChange, onTriggerBlur }: RiskLevelFieldProps) => {
  const { menuStore } = useStores();
  const { locale } = menuStore;
  const styles = useChecklistRuleStyles();
  const [selectedLevel, setSelectedLevel] = React.useState<RiskLevel>(RiskLevel.LOW);

  const currentValue = riskTriggers[selectedLevel];
  const validationError = getMaxLengthError(currentValue, locale);

  return (
    <Field
      label={T.riskLevel[locale]}
      style={{ "--risk-color": customColors.accent.risk[selectedLevel].text } as React.CSSProperties}
    >
      <TabList
        appearance="transparent"
        size="small"
        selectedValue={selectedLevel}
        onTabSelect={(_, data) => setSelectedLevel(data.value as RiskLevel)}
        className={styles.riskTabList}
      >
        {Object.values(RiskLevel).map((level) => (
          <Tab key={level} value={level} className={styles.riskTab}>
            {T[level][locale]}
          </Tab>
        ))}
      </TabList>

      <div className={styles.riskTextarea}>
        <Field validationState={validationError ? "error" : "none"} validationMessage={validationError}>
          <Textarea
            resize="none"
            value={currentValue}
            onChange={(event, data) => {
              onTriggerChange(selectedLevel, sanitizeFieldValue(data.value));
              autoResize(event);
            }}
            onBlur={() => {
              onTriggerBlur(selectedLevel, normalizeFieldValue(currentValue));
            }}
            placeholder={T.riskTriggerPlaceholder[locale]}
          />
        </Field>
      </div>
    </Field>
  );
};

export default RiskLevelField;
