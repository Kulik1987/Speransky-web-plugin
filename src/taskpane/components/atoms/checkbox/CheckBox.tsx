import React, { ReactNode } from "react";
import { Checkbox, Label } from "@fluentui/react-components";
import { useCheckBoxStyles } from "./styles";

interface CheckBoxProps {
  label?: ReactNode;
  disabled?: boolean;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckBox = (props: CheckBoxProps) => {
  const { label, disabled, defaultChecked, checked, onChange } = props;
  const styles = useCheckBoxStyles();

  return (
    <div className={styles.container}>
      <Checkbox
        className={styles.checkbox}
        size="medium"
        disabled={disabled}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={(_, data) => {
          if (onChange) {
            onChange(data.checked === true);
          }
        }}
      />
      {label && (
        <Label disabled={disabled} className={disabled ? styles.labelDisabled : styles.label}>
          {label}
        </Label>
      )}
    </div>
  );
};

export default CheckBox;
