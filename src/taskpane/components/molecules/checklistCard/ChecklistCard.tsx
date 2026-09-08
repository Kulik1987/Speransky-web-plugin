import React from "react";
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Radio,
  Text,
  Tooltip,
  mergeClasses,
} from "@fluentui/react-components";
import { MoreVertical24Regular } from "@fluentui/react-icons";
import { observer } from "mobx-react";
import { useStores } from "../../../store";
import { useChecklistCardStyles } from "./styles";
import { useCommonStyles } from "../../../theme/commonStyles";
import { splitChecklistCopySuffix } from "../../../helpers";
import { HighlightedText } from "../../atoms";

const T = {
  edit: {
    ru: "Редактировать",
    en: "Edit",
  },
  duplicate: {
    ru: "Дублировать",
    en: "Duplicate",
  },
  delete: {
    ru: "Удалить",
    en: "Delete",
  },
};

type ChecklistCardProps = {
  id: string;
  name: string;
  createdAt: string;
  isRadio?: boolean;
  selected?: boolean;
  searchText?: string;
  onSelect?: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

const ChecklistCard = (props: ChecklistCardProps) => {
  const { id, name, createdAt, isRadio = false, selected, searchText, onSelect, onEdit, onDuplicate, onDelete } = props;
  const { menuStore } = useStores();
  const { locale } = menuStore;
  const styles = useChecklistCardStyles();
  const commonStyles = useCommonStyles();

  const formattedDate = new Date(createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US");
  const { base, suffix } = splitChecklistCopySuffix(name);

  return (
    <div className={mergeClasses(styles.card, selected && styles.cardSelected)} onClick={() => onSelect?.(id)}>
      {isRadio && (
        <Radio
          checked={selected}
          onChange={() => onSelect?.(id)}
          className={mergeClasses(commonStyles.radio, styles.radio)}
        />
      )}
      <div className={styles.info}>
        <Tooltip
          content={{ children: name, className: mergeClasses(commonStyles.tooltip, commonStyles.tooltipWide) }}
          relationship="description"
          positioning="above-start"
        >
          <Text className={styles.name}>
            <HighlightedText sourceText={base} searchText={searchText ?? ""} />
            <span className={styles.nameCopyPrefix}>{suffix}</span>
          </Text>
        </Tooltip>
        <Text className={styles.date}>{formattedDate}</Text>
      </div>
      <Menu>
        <MenuTrigger>
          <Button
            className={styles.menuTrigger}
            appearance="transparent"
            icon={<MoreVertical24Regular />}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem onClick={() => onEdit(id)}>{T.edit[locale]}</MenuItem>
            <MenuItem onClick={() => onDuplicate(id)}>{T.duplicate[locale]}</MenuItem>
            <MenuItem onClick={() => onDelete(id)}>{T.delete[locale]}</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};

export default observer(ChecklistCard);
