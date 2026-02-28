/**
 * @description функция очищает значение от недопустимых символов < >
 */
export const sanitizeFieldValue = (value: string): string => value.replace(/[<>]/g, "");

/**
 * @description функция возвращает сообщение об ошибке при превышении количества допустимых символов
 */
export const getMaxLengthError = (value: string, locale: "ru" | "en", maxLength: number = 2000): string | undefined => {
  if (value.length <= maxLength) return undefined;
  return locale === "ru" ? `Не более ${maxLength} символов` : `Maximum ${maxLength} characters`;
};
