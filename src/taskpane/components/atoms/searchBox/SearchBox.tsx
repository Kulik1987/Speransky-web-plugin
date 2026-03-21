import React from "react";
import { SearchBox as SearchBoxUI, mergeClasses } from "@fluentui/react-components";
import { useCommonStyles } from "../../../theme/commonStyles";
import { useSearchBoxStyles } from "./styles";
import { SearchFilled } from "@fluentui/react-icons";

type SearchBoxProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onAdd?: (value: string) => void;
  maxLength?: number;
};

const SearchBox = ({ value = "", onChange, placeholder, onAdd, maxLength }: SearchBoxProps) => {
  const commonStyles = useCommonStyles();
  const styles = useSearchBoxStyles();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onAdd && e.key === "Enter" && value.trim()) onAdd(value.trim());
  };

  const handleBlur = () => {
    if (onAdd && value.trim()) onAdd(value.trim());
  };

  return (
    <SearchBoxUI
      className={mergeClasses(commonStyles.input, styles.searchbox)}
      size="medium"
      value={value}
      placeholder={placeholder}
      onChange={(_, data) => onChange?.(data.value)}
      onKeyDown={handleKeyDown}
      onBlur={onAdd ? handleBlur : undefined}
      maxLength={maxLength}
      contentBefore={<SearchFilled />}
    />
  );
};

export default SearchBox;
