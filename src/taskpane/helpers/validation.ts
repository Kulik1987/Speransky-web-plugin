/**
 * @description функция очищает значение от недопустимых символов < >,
 * схлопывает несколько пробелов в один и обрезает до maxLength символов
 */
export const sanitizeFieldValue = (value: string, maxLength: number = 2000): string => {
  const cleaned = value.replace(/[<>]/g, "").replace(/  +/g, " ");
  return cleaned.slice(0, maxLength);
};

/**
 * @description функция удаляет пробелы по краям
 */
export const normalizeFieldValue = (value: string): string => sanitizeFieldValue(value).trim();

/**
 * @description функция возвращает сообщение об ошибке при превышении количества допустимых символов
 */
export const getMaxLengthError = (value: string, locale: "ru" | "en", maxLength: number = 2000): string | undefined => {
  if (value.length < maxLength) return undefined;
  return locale === "ru" ? `Не более ${maxLength} символов` : `Maximum ${maxLength} characters`;
};

/**
 * @description функция возвращает сообщение об ошибке, если значение совпадает с одним из уже существующих
 */
export const getDuplicateNameError = (
  value: string,
  existingNames: string[],
  locale: "ru" | "en"
): string | undefined => {
  if (!value || !existingNames.includes(value)) return undefined;
  return locale === "ru" ? "Чек-лист с таким названием уже существует" : "A checklist with this name already exists";
};
