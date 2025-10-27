import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Input, makeStyles, shorthands } from "@fluentui/react-components";
import { usePinCodeStyles } from "./styles";

export type PinCodeRef = {
  clearPinCode: () => void;
};

type PinCodeProps = {
  onSuccess: (code: string) => void;
};

const PIN_LENGTH = 4;

const PinCode = forwardRef<PinCodeRef, PinCodeProps>(({ onSuccess }, ref) => {
  const styles = usePinCodeStyles();
  const [values, setValues] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const clearPinCode = () => {
    setValues(Array(PIN_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  };

  useImperativeHandle(ref, () => ({
    clearPinCode,
  }));

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number) => (_: any, data: { value: string }) => {
    const val = data.value.replace(/\D/g, "");
    if (!val) return;

    const newValues = [...values];
    newValues[index] = val[val.length - 1];
    setValues(newValues);

    if (index < PIN_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newValues = [...values];
      if (values[index]) {
        newValues[index] = "";
        setValues(newValues);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, PIN_LENGTH);
    if (paste) {
      setValues(paste.split("").concat(Array(PIN_LENGTH - paste.length).fill("")));
    }
    e.preventDefault();
  };

  useEffect(() => {
    const code = values.join("");
    if (code.length === PIN_LENGTH) {
      onSuccess?.(code);
    }
  }, [values]);

  return (
    <div className={styles.codeRow}>
      {Array.from({ length: PIN_LENGTH }).map((_, i) => (
        <Input
          key={i}
          appearance="outline"
          className={styles.input}
          value={values[i]}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste}
          input={{ ref: (el) => (inputsRef.current[i] = el) }}
          maxLength={1}
          type="tel"
        />
      ))}
    </div>
  );
});

export default PinCode;
