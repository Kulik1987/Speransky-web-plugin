import React, { useState } from "react";
import { Button, Tab, TabList } from "@fluentui/react-components";
import { Add16Regular } from "@fluentui/react-icons";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { PayloadChecklistAddRuleDto, RiskLevel } from "../../../api/types";
import { DraftRule } from "../../../store/checklist";
import { ChecklistRules, RuleType } from "../checklistRules";
import { useChecklistStyles } from "./styles";

const T = {
  modeSimpleTitle: {
    ru: "Стандартный",
    en: "Standard",
  },
  modeSimpleSubtitle: {
    ru: "2 вопроса на правило",
    en: "2 questions per rule",
  },
  modeAdvancedTitle: {
    ru: "Продвинутый",
    en: "Advanced",
  },
  modeAdvancedSubtitle: {
    ru: "6 вопросов на правило",
    en: "6 questions per rule",
  },
  addRulesLabel: {
    ru: "Добавить правило проверки",
    en: "Add check rule",
  },
};

type ChecklistFormProps = {
  onRulesChange: (rules: DraftRule[]) => void;
  initialRules?: DraftRule[];
};

const getRuleType = (rule: DraftRule): RuleType => ("simple_rule" in rule ? "simple" : "advanced");

const isLocalId = (id: string) => id.startsWith("_local_");

const ChecklistForm = ({ onRulesChange, initialRules }: ChecklistFormProps) => {
  const { menuStore, checkList } = useStores();
  const { locale } = menuStore;
  const styles = useChecklistStyles();

  const [ruleMode, setRuleMode] = useState<RuleType>("simple");
  const [rules, setRules] = useState<DraftRule[]>(initialRules ?? []);

  const updateRules = (newRules: DraftRule[]) => {
    setRules(newRules);
    onRulesChange(newRules);
  };

  const handleAddRule = () => {
    const newRule: DraftRule =
      ruleMode === "simple"
        ? {
            id: `_local_${Date.now()}`,
            simple_rule: "",
            risk_level: RiskLevel.LOW,
          }
        : {
            id: `_local_${Date.now()}`,
            check_condition: "",
            required_action: "",
            required_formulation: "",
            why_important: "",
            counterparty_explanation: "",
            risk_trigger: "",
            risk_level: RiskLevel.LOW,
          };
    updateRules([...rules, newRule]);
  };

  const handleChangeRule = (index: number, rule: PayloadChecklistAddRuleDto) => {
    updateRules(rules.map((r, i) => (i === index ? { ...rule, id: r.id } : r)));
  };

  const handleRemoveRule = (index: number) => {
    const rule = rules[index];
    if (rule.id && !isLocalId(rule.id)) {
      checkList.removeRuleById(rule.id);
    }
    updateRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <TabList
        selectedValue={ruleMode}
        onTabSelect={(_, data) => setRuleMode(data.value as RuleType)}
        className={styles.tabList}
      >
        <Tab value="simple" className={styles.tab}>
          <span className={styles.modeTitle}>{T.modeSimpleTitle[locale]}</span>
          <span className={styles.modeSubtitle}>{T.modeSimpleSubtitle[locale]}</span>
        </Tab>
        <Tab value="advanced" className={styles.tab}>
          <span className={styles.modeTitle}>{T.modeAdvancedTitle[locale]}</span>
          <span className={styles.modeSubtitle}>{T.modeAdvancedSubtitle[locale]}</span>
        </Tab>
      </TabList>

      <div className={styles.rulesHeader}>
        <span className={styles.rulesLabel}>{T.addRulesLabel[locale]}</span>
        <Button size="small" appearance="primary" icon={<Add16Regular />} onClick={handleAddRule} />
      </div>

      <div className={styles.rules}>
        {rules.map((rule, index) => (
          <ChecklistRules
            key={rule.id ?? index}
            index={index}
            ruleType={getRuleType(rule)}
            initialValue={rule}
            onChange={handleChangeRule}
            onRemove={handleRemoveRule}
          />
        ))}
      </div>
    </div>
  );
};

export default observer(ChecklistForm);
