import React, { useState } from "react";
import { observer } from "mobx-react";
import { Combobox, Field, mergeClasses, Option } from "@fluentui/react-components";
import { Dismiss16Regular } from "@fluentui/react-icons";
import { useCommonStyles } from "../../../theme/commonStyles";
import { sanitizeFieldValue } from "../../../helpers";
import { useComboboxFieldStyles } from "./styles";

interface ComboboxFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  maxLength: number;
  validationMessage?: string;
}

const ComboboxField = ({ value, onChange, options, placeholder, maxLength, validationMessage }: ComboboxFieldProps) => {
  const commonStyles = useCommonStyles();
  const styles = useComboboxFieldStyles();
  const [search, setSearch] = useState("");

  const filtered = search ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase())) : options;

  const handleClear = () => {
    onChange("");
    setSearch("");
  };

  return (
    <Field validationState={validationMessage ? "error" : "none"} validationMessage={validationMessage}>
      <Combobox
        freeform
        size="large"
        placeholder={placeholder}
        value={value}
        selectedOptions={value ? [value] : []}
        expandIcon={
          value
            ? {
                children: <Dismiss16Regular />,
                onClick: handleClear,
                onMouseDown: (e) => e.preventDefault(),
                className: styles.clearIcon,
              }
            : undefined
        }
        onOptionSelect={(_, data) => {
          if (data.optionValue === undefined) {
            return;
          }
          onChange(data.optionText ?? "");
          setSearch("");
        }}
        onChange={(e) => {
          const v = sanitizeFieldValue(e.target.value, maxLength);
          onChange(v);
          setSearch(v);
        }}
        listbox={{
          className: styles.dropdownList,
          style: { display: filtered.length === 0 ? "none" : undefined },
        }}
        className={mergeClasses(commonStyles.dropdown, value && commonStyles.inputFill)}
      >
        {filtered.map((item) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Combobox>
    </Field>
  );
};

export default observer(ComboboxField);
