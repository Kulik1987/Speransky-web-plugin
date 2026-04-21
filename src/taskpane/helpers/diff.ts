import { diff_match_patch } from "diff-match-patch";
import { customColors } from "../theme/theme";

export function normalizeTabsForDisplay(text: string): string {
  return text.replace(/\t+/g, "_____");
}

export function getDifferencesSemantic(text1: string, text2: string) {
  let dmp = new diff_match_patch();
  var diff = dmp.diff_main(text1, text2);
  dmp.diff_cleanupSemantic(diff);
  return diff;
}

export function htmlChangesMatching(source: string, target: string): string | null {
  // TODO: добавить вывод ошибок
  try {
    let dmp = new diff_match_patch();
    let diff = dmp.diff_main(source, target);

    dmp.diff_cleanupSemantic(diff);

    const array = diff.map((el) => {
      if (Array.isArray(el) && el.length === 2) {
        const actionFlag = el[0];
        const textItem = el[1];

        const isDeleteItem = actionFlag === -1;
        const isCreateItem = actionFlag === 1;
        const isStetItem = actionFlag === 0;

        const displayText = normalizeTabsForDisplay(textItem);

        switch (true) {
          case isDeleteItem:
            return `<del  style="color: ${customColors.accent.removeText};">${displayText}</del>`;
          case isCreateItem:
            return `<inc style="color: ${customColors.accent.risk.low.text}; font-weight: 600;
           ">${displayText}</inc>`;
          case isStetItem:
            return displayText;
          default:
            console.log("empty element", el);
            return ``;
        }
      } else {
        console.log("not Array", el);
        return "";
      }
    });

    const response = array.join("");
    return response;
  } catch (error) {
    console.log("error [htmlChangesMatching]", error);

    return null;
  }
}
