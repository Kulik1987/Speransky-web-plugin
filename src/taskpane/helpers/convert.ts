/**
 * @description функция преобразует строку в массив элементов заданной длины
 */
const splitStringIntoChunks = (str: string, chunkSize: number = 250) => {
  const chunks: string[] = [];
  for (var i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * @description удаляет markdown-ссылки из строки, оставляя только текст ссылки
 * [ст. 708](https://...) → ст. 708
 */
export const MARKDOWN_LINK_SOURCE = "\\[([^\\]]+)\\]\\((https?:\\/\\/[^)]+)\\)";
const removeMarkdownLinks = (text: string): string => text.replace(new RegExp(MARKDOWN_LINK_SOURCE, "g"), "$1");

export const convert = {
  splitStringIntoChunks,
  removeMarkdownLinks,
};
