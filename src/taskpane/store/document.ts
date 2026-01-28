/* global process Word Office */

import { makeAutoObservable, reaction, runInAction } from "mobx";
import type RootStore from ".";
import api from "../api/v1";
import {
  replaceCompanyNames,
  removeAddressesByPart,
  removeAmountByPart,
  removeContract,
  removePayment,
  removePersonData,
} from "../helpers/anonymizer";
import { SourceTypeEnums } from "../enums";

const APP_SET_ANONYMIZER = process.env.APP_SET_ANONYMIZER === "true";

class DocumentStore {
  rootStore: RootStore;
  textContractSource: string | null = null;
  textContractAnonymized: string | null = null;
  docxFile: Blob | null = null;
  legalCaseId: string | null = null;
  documentId: string | null = null;
  documentName: string = "";

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;

    /**
     * @description Реакция срабатывает на изменение в сторе основного текста контракта
     */
    reaction(
      () => this.textContractSource,
      () => {
        if (this.textContractSource?.length > 0) {
          if (APP_SET_ANONYMIZER) this.buildAnonymizedText();
          this.detectDocumentType();
        }
      }
    );
    reaction(
      () => this.textContractAnonymized,
      () => {
        console.log("textContractAnonymized [updated]");
      }
    );
  }

  setDocumentName = (value: string | null) => {
    this.documentName = value;
  };

  /**
   * @description Создает анонимизированный текст контракта и обновляет им textContractAnonymized в сторе
   * */
  buildAnonymizedText = () => {
    const docText = this.textContractSource;
    if (typeof docText !== "string") return null;
    runInAction(() => {
      this.textContractAnonymized = (() => {
        let modText = "";
        modText = removeAddressesByPart(docText);
        modText = removeAmountByPart(modText);
        modText = removePersonData(modText);
        modText = removeContract(modText);
        modText = removePayment(modText);
        modText = replaceCompanyNames(modText);
        return modText;
      })();
    });
  };

  /**
   * @description Копирует текст контракта из документа в стор
   */
  copyTextContractToStore = async () => {
    if (this.textContractSource === null) {
      await Word.run(async (context) => {
        // Получаем активное тело документа
        var body = context.document.body;
        // Загружаем содержимое тела документа
        context.load(body, "text");
        // Выполняем запрос
        return context.sync().then(() => {
          const bodyText = body.text;
          runInAction(() => {
            this.textContractSource = bodyText;
          });
        });
      }).catch((error) => {
        console.error("copyTextContractToStore [error]", error);
      });
    }
  };

  /**
   * @description Получает DOCX файл целиком используя Office.js API
   */
  getDocumentAsBlob = async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      Office.context.document.getFileAsync(Office.FileType.Compressed, { sliceSize: 65536 }, (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          const docFile = result.value;
          let slicesReceived = 0;
          const slices: Uint8Array[] = [];

          const getSlice = (sliceIndex: number) => {
            docFile.getSliceAsync(sliceIndex, (sliceResult) => {
              if (sliceResult.status === Office.AsyncResultStatus.Succeeded) {
                slices.push(new Uint8Array(sliceResult.value.data));
                slicesReceived++;

                if (slicesReceived === docFile.sliceCount) {
                  // Объединяем все части
                  const totalLength = slices.reduce((acc, arr) => acc + arr.length, 0);
                  const combined = new Uint8Array(totalLength);
                  let offset = 0;

                  for (const slice of slices) {
                    combined.set(slice, offset);
                    offset += slice.length;
                  }

                  const blob = new Blob([combined], {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  });

                  docFile.closeAsync();
                  resolve(blob);
                } else {
                  getSlice(sliceIndex + 1);
                }
              } else {
                console.error("getSliceAsync [error]", sliceResult.error);
                docFile.closeAsync();
                resolve(null);
              }
            });
          };

          getSlice(0);
        } else {
          console.error("getFileAsync [error]", result.error);
          resolve(null);
        }
      });
    });
  };

  /**
   * @description Поиск имени из текста документа
   */
  private getDocumentName = async (): Promise<string> => {
    try {
      return await Word.run(async (context) => {
        const body = context.document.body;
        const paragraphs = body.paragraphs;
        paragraphs.load("items");
        await context.sync();

        paragraphs.items.forEach((p) => p.load("text"));
        await context.sync();

        // Ключевые слова для поиска названия документа
        const documentKeywords = [
          "договор",
          "соглашение",
          "контракт",
          "акт",
          "протокол",
          "приложение",
          "дополнительное соглашение",
          "доп соглашение",
          "доп. соглашение",
          "спецификация",
          "дополнение",
        ];

        let foundTitle = "";

        for (const p of paragraphs.items) {
          const text = p.text.trim();

          if (!text) continue;

          // Пропускаем строки, которые явно не являются названием
          if (text.length < 5) continue;
          if (/^[\s_.гГ]{1,50}$/i.test(text)) continue;

          const lowerText = text.toLowerCase();

          // Проверяем наличие ключевых слов
          const hasKeyword = documentKeywords.some((keyword) => lowerText.includes(keyword));
          if (hasKeyword) {
            foundTitle = text;
            break;
          }
        }

        if (!foundTitle) {
          for (const p of paragraphs.items) {
            const text = p.text.trim();
            if (text && text.length >= 5 && !/^[Гг]\.\s*[_\s]+/.test(text)) {
              foundTitle = text;
              break;
            }
          }
        }

        if (!foundTitle) {
          return `Contract_${Date.now()}.docx`;
        }

        // Обработка найденного названия
        const rawTitle = foundTitle.split("№")[0].trim();
        const lowTitle = rawTitle.toLowerCase();
        const normalizedTitle = lowTitle.charAt(0).toUpperCase() + lowTitle.slice(1);
        const cleanTitle = normalizedTitle
          .replace(/[\r\n\t]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        const dbTitle = cleanTitle.replace(/[<>:"/\\|?*]/g, "_");

        return dbTitle.endsWith(".docx") ? dbTitle : `${dbTitle}.docx`;
      });
    } catch (error) {
      console.error("getDocumentName [error]:", error);
      return `Contract_${Date.now()}.docx`;
    }
  };

  /**
   * @description Отправляет документ на сервер для определение типа
   */
  detectDocumentType = async () => {
    try {
      // Получаем документ и его имя
      const [blob, fileName] = await Promise.all([this.getDocumentAsBlob(), this.getDocumentName()]);
      if (!blob) {
        throw new Error("Failed to get docx file");
      }

      // Сохраняем в стор
      runInAction(() => {
        this.docxFile = blob;
        this.documentName = fileName;
      });

      // Конвертируем Blob в File
      const file = new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now(),
      });

      const response = await api.contract.detectType({
        llm_provider: this.rootStore.menuStore.providerLLM,
        file: file,
        source: SourceTypeEnums.PLUGIN,
      });

      const { legal_case_id, document_id } = response.data;

      // Сохраняем ID в стор
      runInAction(() => {
        this.legalCaseId = legal_case_id;
        this.documentId = document_id;
      });

      return response.data;
    } catch (error) {
      console.error("detectDocumentType [error]:", error);
      throw error;
    }
  };

  /**
   * @description Скачивает архив результатов анализа
   */
  downloadArchive = async () => {
    if (!this.documentId) return;

    try {
      const response = await api.contract.archive(this.documentId, true, true, true);
      const blob = response.data;

      const baseName = this.documentName ? this.documentName.replace(/\.docx$/i, "") : "";
      const filename = `Результат проверки _ ${baseName}.zip`;

      // Создаем URL для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("downloadArchive [success]");
    } catch (error) {
      console.error("downloadArchive [error]", error);
    }
  };

  /**
   * @description Очищает стор
   */
  reset = () => {
    runInAction(() => {
      this.textContractSource = null;
      this.textContractAnonymized = null;
      this.docxFile = null;
      this.documentName = "";
    });
  };
}

export default DocumentStore;
