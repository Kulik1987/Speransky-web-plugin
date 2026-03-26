import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Field,
  Textarea,
  mergeClasses,
} from "@fluentui/react-components";
import { Delete24Regular, TriangleDownFilled, TriangleRightFilled } from "@fluentui/react-icons";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { PayloadChecklistAddRuleDto, RiskLevel } from "../../../api/types";
import RuleAdvancedFields, { AdvancedField, AdvancedFieldsState } from "./RuleAdvancedFields";
import RiskLevelField, { RiskTriggers } from "./RiskLevelField";
import { useChecklistRuleStyles } from "./styles";
import { useCommonStyles } from "../../../theme/commonStyles";
import { SIMPLE_RULE_FIELD } from "../../../constants";
import { IconButton, Modal } from "../../atoms";
import { customColors } from "../../../theme/theme";
import {
  autoResize,
  getMaxLengthError,
  normalizeFieldValue,
  resizeTextarea,
  sanitizeFieldValue,
} from "../../../helpers";

const T = {
  ruleTitle: {
    ru: "Правило ",
    en: "Rule ",
  },
  deleteRuleTitle: {
    ru: "Удалить правило",
    en: "Delete rule",
  },
  deleteConfirm: {
    ru: "Удалить",
    en: "Delete",
  },
  requiredField: {
    ru: "Обязательное поле",
    en: "Required field",
  },
  ruleSimpleFlag: {
    ru: "Стандартное",
    en: "Standard",
  },
  ruleAdvancedFlag: {
    ru: "Продвинутое",
    en: "Advanced",
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
  advanced: AdvancedFieldsState;
  riskTriggers: RiskTriggers;
};

const riskTriggersToPayload = (triggers: RiskTriggers) => {
  const result = Object.entries(triggers)
    .filter(([, v]) => v.trim() !== "")
    .map(([level, trigger]) => ({ risk_level: level as RiskLevel, risk_trigger: trigger }));
  return result;
};

const riskTriggersFromPayload = (triggers?: { risk_level: RiskLevel; risk_trigger: string }[] | null): RiskTriggers => {
  const base: RiskTriggers = { [RiskLevel.LOW]: "", [RiskLevel.MEDIUM]: "", [RiskLevel.HIGH]: "" };
  if (!triggers) return base;
  for (const t of triggers) {
    base[t.risk_level] = t.risk_trigger;
  }
  return base;
};

const buildPayload = (type: RuleType, state: RuleState): PayloadChecklistAddRuleDto =>
  type === "simple"
    ? {
        simple_rule: state.simple,
        risk_triggers: riskTriggersToPayload(state.riskTriggers),
      }
    : {
        check_condition: state.advanced.checkCondition,
        required_action: state.advanced.requiredAction || undefined,
        required_formulation: state.advanced.requiredFormulation || undefined,
        why_important: state.advanced.whyImportant || undefined,
        counterparty_explanation: state.advanced.counterpartyExplanation || undefined,
        risk_triggers: riskTriggersToPayload(state.riskTriggers),
      };

const iconStyle = { width: "12px", height: "12px", padding: "5px" };

const ChecklistRules = ({ index, ruleType, initialValue, onChange, onRemove }: ChecklistRuleProps) => {
  const { menuStore } = useStores();
  const { locale } = menuStore;
  const commonStyles = useCommonStyles();
  const styles = useChecklistRuleStyles();

  const [simpleTouched, setSimpleTouched] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [targetId, setTargetId] = useState<string | number | null>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialValue) return;
    fieldsRef.current?.querySelectorAll("textarea").forEach((el) => resizeTextarea(el));
  }, []);

  const simpleIv = initialValue && "simple_rule" in initialValue ? initialValue : null;
  const advancedIv = initialValue && "check_condition" in initialValue ? initialValue : null;

  const [ruleState, setRuleState] = useState<RuleState>({
    simple: simpleIv?.simple_rule ?? "",
    advanced: {
      checkCondition: advancedIv?.check_condition ?? "",
      requiredAction: advancedIv?.required_action ?? "",
      requiredFormulation: advancedIv?.required_formulation ?? "",
      whyImportant: advancedIv?.why_important ?? "",
      counterpartyExplanation: advancedIv?.counterparty_explanation ?? "",
    },
    riskTriggers: riskTriggersFromPayload(initialValue?.risk_triggers),
  });

  const update = (patch: Partial<RuleState>) => {
    const next = { ...ruleState, ...patch };
    setRuleState(next);
    onChange(index, buildPayload(ruleType, next));
  };

  const handleSimpleChange = (value: string) => update({ simple: value });

  const handleAdvancedChange = (field: AdvancedField, value: string) =>
    update({ advanced: { ...ruleState.advanced, [field]: value } });

  const handleRiskTriggerChange = (level: RiskLevel, value: string) =>
    update({ riskTriggers: { ...ruleState.riskTriggers, [level]: value } });

  const handleRiskTriggerBlur = (level: RiskLevel, value: string) =>
    update({ riskTriggers: { ...ruleState.riskTriggers, [level]: value } });

  const handleDeleteRule = () => setTargetId(index);
  const handleDeleteRuleConfirm = () => {
    onRemove(index);
    setTargetId(null);
  };

  const validationSimpleField =
    simpleTouched && !ruleState.simple ? T.requiredField[locale] : getMaxLengthError(ruleState.simple, locale);

  return (
    <div className={styles.container}>
      <Modal
        open={targetId !== null}
        onClose={() => setTargetId(null)}
        title={`${T.deleteRuleTitle[locale]}?`}
        actionButtonTitle={T.deleteConfirm[locale]}
        onAction={handleDeleteRuleConfirm}
      />

      <Accordion
        collapsible
        openItems={isOpen ? ["rule"] : []}
        onToggle={(_, data) => setIsOpen(data.openItems.includes("rule"))}
      >
        <AccordionItem value="rule" className={commonStyles.accordionItem}>
          <AccordionHeader
            className={mergeClasses(commonStyles.accordionHeader, styles.accordionHeader)}
            expandIcon={isOpen ? <TriangleDownFilled style={iconStyle} /> : <TriangleRightFilled style={iconStyle} />}
          >
            {T.ruleTitle[locale]}
            {index + 1}
            <div className={mergeClasses(styles.ruleFlag, styles[ruleType])}>
              {ruleType === "simple" ? T.ruleSimpleFlag[locale] : T.ruleAdvancedFlag[locale]}
            </div>
          </AccordionHeader>

          <AccordionPanel className={styles.accordionPanel}>
            <div ref={fieldsRef} className={styles.fields}>
              {ruleType === "simple" ? (
                <Field
                  label={SIMPLE_RULE_FIELD.label[locale]}
                  required
                  validationState={validationSimpleField ? "error" : "none"}
                  validationMessage={validationSimpleField}
                >
                  <Textarea
                    resize="none"
                    value={ruleState.simple}
                    onChange={(event, data) => {
                      handleSimpleChange(sanitizeFieldValue(data.value));
                      autoResize(event);
                    }}
                    onBlur={() => {
                      setSimpleTouched(true);
                      handleSimpleChange(normalizeFieldValue(ruleState.simple));
                    }}
                    placeholder={SIMPLE_RULE_FIELD.placeholder[locale]}
                  />
                </Field>
              ) : (
                <RuleAdvancedFields {...ruleState.advanced} onChange={handleAdvancedChange} />
              )}

              <RiskLevelField
                riskTriggers={ruleState.riskTriggers}
                onTriggerChange={handleRiskTriggerChange}
                onTriggerBlur={handleRiskTriggerBlur}
              />

              <IconButton
                tooltip={T.deleteRuleTitle[locale]}
                icon={<Delete24Regular color={customColors.accent.delete} />}
                onClick={handleDeleteRule}
                positioning="above-end"
                className={styles.btnDelete}
              />
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default observer(ChecklistRules);
