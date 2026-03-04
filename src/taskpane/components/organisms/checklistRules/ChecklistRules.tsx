import React, { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Field,
  Textarea,
  mergeClasses,
} from "@fluentui/react-components";
import { Delete24Regular, TriangleDownFilled, TriangleRightFilled } from "@fluentui/react-icons";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { PayloadChecklistAddRuleDto, RiskLevel } from "../../../api/types";
import RuleAdvancedFields, { AdvancedField, AdvancedFieldsState } from "./RuleAdvancedFields";
import { useChecklistRuleStyles } from "./styles";
import { SIMPLE_RULE_FIELD } from "../../../constants";
import { Modal } from "../../atoms";
import { customColors } from "../../../theme/theme";

const T = {
  ruleTitle: {
    ru: "Правило ",
    en: "Rule ",
  },
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
  deleteRuleTitle: {
    ru: "Удалить правило?",
    en: "Delete rule?",
  },
  deleteConfirm: {
    ru: "Удалить",
    en: "Delete",
  },
};

export type RuleType = "simple" | "advanced";

type ChecklistRuleProps = {
  index: number;
  ruleType: RuleType;
  initialValue?: PayloadChecklistAddRuleDto;
  onChange: (index: number, rule: PayloadChecklistAddRuleDto) => void;
  onRemove: (index: number) => void;
};

type RuleState = {
  simple: string;
  riskLevel: RiskLevel;
  riskTrigger: string;
  advanced: AdvancedFieldsState;
};

const buildPayload = (type: RuleType, state: RuleState): PayloadChecklistAddRuleDto =>
  type === "simple"
    ? {
        simple_rule: state.simple,
        risk_level: state.riskLevel,
      }
    : {
        check_condition: state.advanced.checkCondition,
        required_action: state.advanced.requiredAction || undefined,
        required_formulation: state.advanced.requiredFormulation || undefined,
        why_important: state.advanced.whyImportant || undefined,
        counterparty_explanation: state.advanced.counterpartyExplanation || undefined,
        risk_trigger: state.riskTrigger || undefined,
        risk_level: state.riskLevel,
      };

const iconStyle = { width: "9px", height: "9px", padding: "8px" };

const ChecklistRules = ({ index, ruleType, initialValue, onChange, onRemove }: ChecklistRuleProps) => {
  const { menuStore } = useStores();
  const { locale } = menuStore;
  const styles = useChecklistRuleStyles();

  const [isOpen, setIsOpen] = useState(true);
  const [targetId, setTargetId] = useState<string | number | null>(null);

  const simpleIv = initialValue && "simple_rule" in initialValue ? initialValue : null;
  const advancedIv = initialValue && "check_condition" in initialValue ? initialValue : null;

  const [ruleState, setRuleState] = useState<RuleState>({
    simple: simpleIv?.simple_rule ?? "",
    riskLevel: initialValue?.risk_level ?? RiskLevel.LOW,
    riskTrigger: advancedIv?.risk_trigger ?? "",
    advanced: {
      checkCondition: advancedIv?.check_condition ?? "",
      requiredAction: advancedIv?.required_action ?? "",
      requiredFormulation: advancedIv?.required_formulation ?? "",
      whyImportant: advancedIv?.why_important ?? "",
      counterpartyExplanation: advancedIv?.counterparty_explanation ?? "",
    },
  });

  const update = (patch: Partial<RuleState>) => {
    const next = { ...ruleState, ...patch };
    setRuleState(next);
    onChange(index, buildPayload(ruleType, next));
  };

  const handleSimpleChange = (value: string) => update({ simple: value });

  const handleAdvancedChange = (field: AdvancedField, value: string) =>
    update({ advanced: { ...ruleState.advanced, [field]: value } });

  const handleRiskLevelChange = (level: RiskLevel) => update({ riskLevel: level });

  const handleDeleteRule = () => setTargetId(index);
  const handleDeleteRuleConfirm = () => {
    onRemove(index);
    setTargetId(null);
  };

  return (
    <div className={styles.container}>
      <Modal
        open={targetId !== null}
        onClose={() => setTargetId(null)}
        title={T.deleteRuleTitle[locale]}
        actionButtonTitle={T.deleteConfirm[locale]}
        onAction={handleDeleteRuleConfirm}
      />

      <Accordion
        collapsible
        openItems={isOpen ? ["rule"] : []}
        onToggle={(_, data) => setIsOpen(data.openItems.includes("rule"))}
      >
        <AccordionItem value="rule" className={styles.accordionItem}>
          <AccordionHeader
            className={styles.accordionHeader}
            expandIcon={isOpen ? <TriangleDownFilled style={iconStyle} /> : <TriangleRightFilled style={iconStyle} />}
          >
            {T.ruleTitle[locale]}
            {index + 1}
          </AccordionHeader>

          <AccordionPanel className={styles.accordionPanel}>
            <div className={styles.fields}>
              {ruleType === "simple" ? (
                <Field label={SIMPLE_RULE_FIELD.label[locale]} required>
                  <Textarea
                    resize="none"
                    value={ruleState.simple}
                    onChange={(_, data) => {
                      handleSimpleChange(data.value);
                    }}
                    placeholder={SIMPLE_RULE_FIELD.placeholder[locale]}
                  />
                </Field>
              ) : (
                <RuleAdvancedFields {...ruleState.advanced} onChange={handleAdvancedChange} />
              )}

              <div className={styles.riskSection}>
                <Field label={T.riskLevel[locale]} required>
                  <div className={styles.riskBtnBlock}>
                    {Object.values(RiskLevel).map((risk) => (
                      <Button
                        key={risk}
                        className={mergeClasses(
                          styles.btnRisk,
                          styles.btnRiskHover,
                          ruleState.riskLevel === risk && styles.btnRiskSelected
                        )}
                        style={{ "--risk-color": customColors.accent.risk[risk] } as React.CSSProperties}
                        appearance="outline"
                        onClick={() => handleRiskLevelChange(risk)}
                      >
                        {T[risk][locale]}
                      </Button>
                    ))}
                  </div>

                  {ruleType === "advanced" && (
                    <Textarea
                      resize="none"
                      value={ruleState.riskTrigger}
                      onChange={(_, data) => update({ riskTrigger: data.value })}
                      placeholder={T.riskTriggerPlaceholder[locale]}
                    />
                  )}
                </Field>

                <Button
                  className={styles.btnDelete}
                  appearance="subtle"
                  icon={<Delete24Regular color={customColors.accent.delete} />}
                  onClick={handleDeleteRule}
                />
              </div>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default observer(ChecklistRules);
