/* global Word */
/// <reference types="office-js" />

const MAX_LENGTH_SEARCH_STRING = 100;

export class SearchService {
  static async findRange(context: Word.RequestContext, searchText: string): Promise<Word.Range | null> {
    try {
      if (!searchText || searchText.trim().length === 0) {
        console.log("Search text is empty");
        return null;
      }

      const searchTextLength = searchText.length;
      const isSearchTextLessMaxLength = searchTextLength <= MAX_LENGTH_SEARCH_STRING;

      console.log("SEARCH TEXT:", { isSearchTextLessMaxLength, searchText, length: searchTextLength });

      /** Длина текста МЕНЬШЕ лимита */
      if (isSearchTextLessMaxLength) {
        const range = await this.searchText(context, searchText);
        context.load(range, "items");
        await context.sync();

        if (range.items.length === 0) return null;

        const start = range.getFirst();
        context.load(start);
        await context.sync();

        return start;
      }

      /** Длина текста БОЛЬШЕ лимита */
      const textStart = searchText.slice(0, MAX_LENGTH_SEARCH_STRING);
      const textEnd = searchText.slice(searchTextLength - MAX_LENGTH_SEARCH_STRING, searchTextLength);

      const rangeStart = await this.searchText(context, textStart);
      const rangeEnd = await this.searchText(context, textEnd);

      context.load(rangeStart, "items");
      context.load(rangeEnd, "items");
      await context.sync();

      const isRangeStartExist = rangeStart.items.length > 0;
      const isRangeEndExist = rangeEnd.items.length > 0;

      console.log("RANGE", { textStart, textEnd, isRangeStartExist, isRangeEndExist });

      if (!isRangeStartExist || !isRangeEndExist) return null;

      const start = rangeStart.getFirst();
      const end = rangeEnd.getFirst();

      context.load(start);
      context.load(end);
      await context.sync();

      const expandedRange = start.expandTo(end);
      context.load(expandedRange);
      await context.sync();

      return expandedRange;
    } catch (error) {
      console.log("[findRange] error", error);
      return null;
    }
  }

  private static async searchText(context: Word.RequestContext, value: string) {
    try {
      const body = context.document.body;
      const normalizedValue = value.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

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
