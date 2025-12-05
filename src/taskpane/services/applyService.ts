/* global Word */
/// <reference types="office-js" />
import { OptionsSupportedCurrentApiI } from "../store/config";
import { getDifferencesSemantic } from "../helpers/diff";
import { SearchService } from "./searchService";

interface ApplyChangeI {
  sourceText: string;
  changeText: string;
  optionsSupportedCurrentApi: OptionsSupportedCurrentApiI;
  type: string;
}

interface ApplyCommentI {
  sourceText: string;
  changeText: string;
  commentText: string;
}

export class ApplyService {
  static async applyChange(props: ApplyChangeI) {
    try {
      const { sourceText: searchText, changeText: editText, optionsSupportedCurrentApi, type } = props;
      console.log("[applyChange]", { searchText, editText, type });

      const { isAccessToRangeInsertText, isAccessToRangeInsertTextSemantic } = optionsSupportedCurrentApi;
      if (type === "new") {
        await this.applyChangeAddNewParagraph(searchText, editText);
      } else {
        if (isAccessToRangeInsertTextSemantic) {
          this.applyChangeSemantic(searchText, editText);
        } else if (isAccessToRangeInsertText) {
          this.applyChangeBasic(searchText, editText);
        }
      }
    } catch (error) {
      console.log("error", error);
      return null;
    }
  }

  static async applyChangeAddNewParagraph(searchText: string, newParagraphText: string) {
    await Word.run(async (context) => {
      const range = await SearchService.findRange(context, searchText);
      range.insertParagraph(newParagraphText, Word.InsertLocation.after);
      await context.sync();
    }).catch((error) => {
      console.log("Error [applyChangeAddNewParagraph]: " + error);
    });
  }

  static async applyChangeBasic(searchText: string, changeText: string) {
    await Word.run(async (context) => {
      const range = await SearchService.findRange(context, searchText);
      range.insertText(changeText, "Replace");
    }).catch((error) => {
      console.log("Error [handleShowInDocument]: " + error);
    });
  }

  static async applyChangeSemantic(searchText: string, changeText: string) {
    const differencesArray = getDifferencesSemantic(searchText, changeText);
    console.log("differencesArray", differencesArray);

    await Word.run(async (context) => {
      const rangeAppliedChanges = await SearchService.findRange(context, changeText);

      if (rangeAppliedChanges === null) {
        const findRange = await SearchService.findRange(context, searchText);
        findRange.clear();
        const trackedChangeR = findRange.getTrackedChanges();
        context.load(trackedChangeR, "items");
        await context.sync();
        trackedChangeR.items[0].accept();

        for (const diffItem of differencesArray) {
          try {
            let isStable = diffItem[0] === 0;
            let isCreate = diffItem[0] === 1;
            let isDelete = diffItem[0] === -1;
            let inputText = diffItem[1];

            const insertedItem = findRange.insertText(inputText, Word.InsertLocation.end);
            context.load(insertedItem, "text");
            await context.sync();

            if (isStable) {
              const trackedChangeItem = insertedItem.getTrackedChanges();
              context.load(trackedChangeItem, "items");
              await context.sync();
              trackedChangeItem.items[0].accept();
            }

            if (isCreate) {
              // новый элемент отобразится как правка в режиме рецензирования
            }

            if (isDelete) {
              const trackedChangeItem = insertedItem.getTrackedChanges();
              context.load(trackedChangeItem, "items");
              await context.sync();
              trackedChangeItem.items[0].accept();
              insertedItem.clear();
            }
          } catch (error) {
            console.log("error", error);
          }
        }
      }
    }).catch((error) => {
      console.log("Error [handleShowInDocument]: " + error);
    });
  }

  static async applyComment(props: ApplyCommentI) {
    const { sourceText, changeText, commentText } = props;

    await Word.run(async (context) => {
      console.log("[applyComment]", { context, sourceText, changeText, commentText });

      try {
        let findRange = await SearchService.findRange(context, changeText);
        if (findRange === null) {
          findRange = await SearchService.findRange(context, sourceText);
        }

        const comments = findRange.getComments();
        comments.load("items");
        await context.sync();
        const isCommentExist = comments.items.some((el) => el.content === commentText);

        if (isCommentExist) {
          console.log("Этот комментарий уже добавлен!");
        } else {
          findRange.insertComment(commentText);
        }
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    }).catch((error) => {
      console.log("Error [applyComment]: " + error);
    });
  }
}
