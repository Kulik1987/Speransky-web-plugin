const COPY_SUFFIX_REGEX = / \(Копия(?: (\d+))?\)$/;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** @description Убирает суффикс "(Копия)"/"(Копия N)", чтобы копия копии не накапливала суффиксы */
export const getBaseChecklistName = (name: string) => name.replace(COPY_SUFFIX_REGEX, "");

/** @description Разбивает имя чек-листа на основную часть и суффикс "(Копия)"/"(Копия N)" (для отдельного отображения) */
export const splitChecklistCopySuffix = (name: string): { base: string; suffix: string | null } => {
  const match = name.match(COPY_SUFFIX_REGEX);
  if (!match) return { base: name, suffix: null };
  return { base: name.slice(0, match.index), suffix: match[0] };
};

/** @description Подбирает следующее свободное имя копии: "Название (Копия)", "Название (Копия 2)", ... */
export const getCopyName = (originalName: string, existingNames: string[]): string => {
  const baseName = getBaseChecklistName(originalName);
  const copyPattern = new RegExp(`^${escapeRegExp(baseName)} \\(Копия(?: (\\d+))?\\)$`);

  const usedNumbers = existingNames
    .map((name) => name.match(copyPattern)?.[1])
    .filter((n): n is string => !!n)
    .map(Number);

  const hasUnnumberedCopy = existingNames.includes(`${baseName} (Копия)`);
  if (!hasUnnumberedCopy) return `${baseName} (Копия)`;

  const nextNumber = usedNumbers.length > 0 ? Math.max(...usedNumbers) + 1 : 2;
  return `${baseName} (Копия ${nextNumber})`;
};
