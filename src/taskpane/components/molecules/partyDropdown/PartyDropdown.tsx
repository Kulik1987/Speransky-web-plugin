import React from "react";
import { observer } from "mobx-react";
import { Dropdown, Option } from "@fluentui/react-components";
import type { OptionOnSelectData, SelectionEvents } from "@fluentui/react-components";
import { useStores } from "../../../store";

const ALL_PARTIES_VALUE = "all";

type PartySelectOption = {
  label: string;
  value: string;
};

interface PartyDropdownProps {
  placeholder: string;
  allPartiesLabel?: string;
  onSelect?: (hasSelection: boolean) => void;
}

const PartyDropdown = ({ placeholder, allPartiesLabel = "Все стороны", onSelect }: PartyDropdownProps) => {
  const { suggestionsStore } = useStores();
  const { parties } = suggestionsStore;

  const isPartiesExist = Array.isArray(parties) && parties?.length > 0;

  const partyOptions: PartySelectOption[] = [
    { label: allPartiesLabel, value: ALL_PARTIES_VALUE },
    ...(parties ?? []).map((p) => ({ label: p.role, value: p.role })),
  ];

  const handleChangeParty = (_event: SelectionEvents, data: OptionOnSelectData) => {
    const value = data.optionValue ?? "";
    // Конвертируем ALL_PARTIES_VALUE в null для store
    suggestionsStore.setFormPartySelected(value === ALL_PARTIES_VALUE ? null : value);
    onSelect?.(true);
  };

  return (
    <Dropdown
      id="selectParty"
      placeholder={placeholder}
      disabled={!isPartiesExist}
      onOptionSelect={handleChangeParty}
      size="large"
    >
      {partyOptions.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Dropdown>
  );
};

export default observer(PartyDropdown);
