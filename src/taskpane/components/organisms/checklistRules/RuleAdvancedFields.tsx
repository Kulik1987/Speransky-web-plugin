import React, { useState } from "react";
import { Field, Textarea } from "@fluentui/react-components";
import { useStores } from "../../../store";
import { useChecklistRuleStyles } from "./styles";
import { ADVANCED_RULE_FIELDS } from "../../../constants";
import { autoResize, getMaxLengthError, normalizeFieldValue, sanitizeFieldValue } from "../../../helpers";

const T = {
  requiredField: {
    ru: "Обязательное поле",
    en: "Required field",
  },
};

const FIELDS = [
  "checkCondition",
  "requiredAction",
  "requiredFormulation",
  "whyImportant",
  "counterpartyExplanation",
] as const;

export type AdvancedField = (typeof FIELDS)[number];
export type AdvancedFieldsState = Record<AdvancedField, string>;

type RuleAdvancedFieldsProps = AdvancedFieldsState & {
  onChange: (field: AdvancedField, value: string) => void;
};

const RuleAdvancedFields = ({ onChange, ...values }: RuleAdvancedFieldsProps) => {
  const { menuStore } = useStores();
  const { locale } = menuStore;
  const styles = useChecklistRuleStyles();

  const [checkConditionTouched, setCheckConditionTouched] = useState(false);

  return (
    <div className={styles.fields}>
      {FIELDS.map((field) => {
        const isRequired = field === "checkCondition";
        const error =
          isRequired && checkConditionTouched && !values[field]
            ? T.requiredField[locale]
            : getMaxLengthError(values[field], locale);
        return (
          <Field
            key={field}
            label={ADVANCED_RULE_FIELDS[field].label[locale]}
            required={isRequired}
            validationState={error ? "error" : "none"}
            validationMessage={error}
          >
            <Textarea
              resize="none"
              value={values[field]}
              onChange={(event, data) => {
                onChange(field, sanitizeFieldValue(data.value));
                autoResize(event);
              }}
              onBlur={() => {
                if (isRequired) setCheckConditionTouched(true);
                onChange(field, normalizeFieldValue(values[field]));
              }}
              placeholder={ADVANCED_RULE_FIELDS[field].placeholder[locale]}
            />
          </Field>
        );
      })}
    </div>
  );
};

export default RuleAdvancedFields;
