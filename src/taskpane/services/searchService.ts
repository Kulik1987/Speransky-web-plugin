/* global Word */
/// <reference types="office-js" />

const MAX_LENGTH_SEARCH_STRING = 100;
const MIN_ANCHOR_LENGTH = 15;

export class SearchService {
  /** @description Поиск диапазона текста в документе */
  static async findRange(context: Word.RequestContext, searchText: string): Promise<Word.Range | null> {
    try {
      if (!searchText || searchText.trim().length === 0) {
        console.log("Search text is empty");
        return null;
      }

      // Текст с табами или переносами
      const hasSeparators = searchText.includes("\t") || searchText.includes("\n") || searchText.includes("\r");

      console.log("SEARCH TEXT:", { searchText, length: searchText.length, hasSeparators });

      // Обычный текст — ищем напрямую через Word API
      if (!hasSeparators) {
        return await this.findRangeDirect(context, searchText);
      }

      // Текст с бланками/переносами — ищем по смысловым якорям
      return await this.findRangeByAnchors(context, searchText);
    } catch (error) {
      console.log("[findRange] error", error);
      return null;
    }
  }

  /** @description Прямой поиск - для обычного текста */
  private static async findRangeDirect(context: Word.RequestContext, searchText: string): Promise<Word.Range | null> {
    const len = searchText.length;

    if (len <= MAX_LENGTH_SEARCH_STRING) {
      const range = await this.searchText(context, searchText);
      context.load(range, "items");
      await context.sync();
      if (range.items.length === 0) return null;
      const start = range.getFirst();
      context.load(start);
      await context.sync();
      return start;
    }

    // Длина текста БОЛЬШЕ лимита
    const textStart = searchText.slice(0, MAX_LENGTH_SEARCH_STRING);
    const textEnd = searchText.slice(len - MAX_LENGTH_SEARCH_STRING);

    const rangeStart = await this.searchText(context, textStart);
    const rangeEnd = await this.searchText(context, textEnd);
    context.load(rangeStart, "items");
    context.load(rangeEnd, "items");
    await context.sync();

    if (rangeStart.items.length === 0 || rangeEnd.items.length === 0) return null;

    const start = rangeStart.getFirst();
    const end = rangeEnd.getFirst();
    context.load(start);
    context.load(end);
    await context.sync();

    // expandTo объединяет два найденных диапазона
    const expandedRange = start.expandTo(end);
    context.load(expandedRange);
    await context.sync();
    return expandedRange;
  }

  /** @description Поиск по якорям - для текстов с табами (\t) и переносами строк (\n) */
  private static async findRangeByAnchors(
    context: Word.RequestContext,
    searchText: string
  ): Promise<Word.Range | null> {
    const segments = searchText
      .split(/[\t\n\r]+/)
      .map((s) => s.replace(/ +/g, " ").trim())
      .filter((s) => s.length >= MIN_ANCHOR_LENGTH);

    console.log("[findRangeByAnchors] segments:", segments);

    if (segments.length === 0) return null;

    // Первый якорь — начало абзаца
    const firstAnchor = segments[0].slice(0, MAX_LENGTH_SEARCH_STRING);
    // Последний якорь — конец абзаца
    const lastAnchor = segments[segments.length - 1].slice(
      Math.max(0, segments[segments.length - 1].length - MAX_LENGTH_SEARCH_STRING)
    );

    const rangeFirst = await this.searchText(context, firstAnchor);
    context.load(rangeFirst, "items");
    await context.sync();

    if (rangeFirst.items.length === 0) {
      console.log("[findRangeByAnchors] first anchor not found:", firstAnchor);
      return null;
    }

    // Если якоря совпадают, возвращаем один сегмент
    if (firstAnchor === lastAnchor) {
      const start = rangeFirst.getFirst();
      context.load(start);
      await context.sync();
      return start;
    }

    const rangeLast = await this.searchText(context, lastAnchor);
    context.load(rangeLast, "items");
    await context.sync();

    if (rangeLast.items.length === 0) {
      const start = rangeFirst.getFirst();
      context.load(start);
      await context.sync();
      return start;
    }

    const start = rangeFirst.getFirst();
    const end = rangeLast.getFirst();
    context.load(start);
    context.load(end);
    await context.sync();

    // Растягиваем диапазон от первого якоря до последнего и возвращаем
    const expandedRange = start.expandTo(end);
    context.load(expandedRange);
    await context.sync();
    return expandedRange;
  }

  /** @description Поиск текста с игнорированием количества пробелов и знаков препинания */
  private static async searchText(context: Word.RequestContext, value: string) {
    try {
      const body = context.document.body;
      const normalizedValue = value.replace(/\r?\n/g, " ").replace(/ +/g, " ").trim();

      const rangeCollection = body.search(normalizedValue, {
        ignoreSpace: true,
        ignorePunct: true,
      });
      console.log("[rangeCollection]", rangeCollection);

      return rangeCollection;
    } catch (error) {
      console.log("[searchText] error", error);
      throw error;
    }
  }
}
