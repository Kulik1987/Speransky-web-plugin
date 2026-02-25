function findAndReplaceParties(
  text: string,
  companyMap: Map<any, any>,
  normilizedMap: Map<any, any>,
  regex: RegExp
): string {
  const pattern = new RegExp(regex, "g");
  let matcher: RegExpExecArray | null;

  while ((matcher = pattern.exec(text)) !== null) {
    const originalName: string = matcher[0];
    const normalizedName: string = normalizeCompanyName(originalName);
    const abbreviation: string = getAbbreviation(normalizedName);
    let replacement: string = "*******";

    if (normilizedMap.get(normalizedName)) {
      replacement = normilizedMap.get(normalizedName);
    } else if (normilizedMap.get(abbreviation)) {
      replacement = normilizedMap.get(abbreviation);
    } else {
      normilizedMap.set(normalizedName, replacement);
      normilizedMap.set(abbreviation, replacement);
    }

    companyMap.set(replacement, originalName);
    text = text.replaceAll(originalName, replacement);
  }

  return text;
}

function normalizeCompanyName(name: string) {
  let normalized = name
    .toLowerCase()
    .replace(/«|»/g, "")
    .replace(
      /(?:^|\s)(?:ооо|зао|пао|оао|ип|акционерное общество|общество с ограниченной ответственностью|ао)(?=\s|$)/g,
      ""
    )
    .replace(/[^a-zа-яё0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return normalized;
}

function getAbbreviation(name: string): string {
  const words: string[] = name.split(/\s+/);
  const abbreviation: string[] = [];

  for (const word of words) {
    if (word.trim() !== "") {
      abbreviation.push(word.charAt(0));
    }
  }

  return abbreviation.join("");
}

const replaceCompanyNames = (inputString: string): string => {
  const companyMap = new Map();
  const normilizedMap = new Map();

  let text: string;

  //
  //! OOO
  const regexOOOFull =
    /(?<=Общество с ограниченной ответственностью\s*(?:\(ООО\)\s*)?|Общества с ограниченной ответственностью\s*(?:\(ООО\)\s*)?)«.*?»|Общество с ограниченной ответственностью\s*«.*?»|Общества с ограниченной ответственностью\s*(?:СЗ\s*)?«.*?»/;
  const regexOOOShort = /ООО\s*(?:СЗ\s*)?«.*?»/;

  //! PAO
  const regexPAOFull =
    /(?<=Публичное акционерное общество\s*(?:\(ПАО\))?\s*|Публичного акционерного общества\s*(?:\(ПАО\))?\s*)«.*?»/;
  const regexPAOShort = /ПАО\s*(?:СЗ\s*)?«.*?»/;

  //! ZAO
  const regexZAOFull =
    /(?<=Закрытое акционерное общество\s*(?:\(ЗАО\))?\s*|Закрытого акционерного общества\s*(?:\(ЗАО\))?\s*)«.*?»/;
  // const regexZAOShort = /(?<=ЗАО\s*)«.*?»/;
  const regexZAOShort = /ЗАО\s*(?:СЗ\s*)?«.*?»/;

  //! OAO
  const regexOAOFull =
    /(?<=Открытое акционерное общество\s*(?:\(ОАО\))?\s*|Открытого акционерного общества\s*(?:\(ОАО\))?\s*)«.*?»/;
  // const regexOAOShort = /(?<=ОАО\s*)«.*?»/;
  const regexOAOShort = /ОАО\s*(?:СЗ\s*)?«.*?»/;

  //! AO
  const regexAOFull = /(?<=Акционерное общество\s*(?:\(АО\))?\s*|Акционерного общества\s*(?:\(АО\))?\s*)«.*?»/;
  //// const regexAOShort = /АО\s*«.*?»/;
  const regexAOShort = /АО\s*(?:СЗ\s*)?«.*?»/;

  // GUP
  const regexGUPFull =
    /(?<=Государственное унитарное предприятие\s*(?:\(ГУП\))?\s*|Государственного унитарного предприятия\s*(?:\(ГУП\))?\s*)«.*?»/;
  const regexGUPShort = /(?<=ГУП\s*)«.*?»/;

  // FGUP
  const regexFGUPFull =
    /(?<=Федеральное государственное унитарное предприятие\s*(?:\(ФГУП\))?\s*|Федерального государственного унитарного предприятия\s*(?:\(ФГУП\))?\s*)«.*?»/;
  const regexFGUPShort = /(?<=ФГУП\s*)«.*?»/;

  // KB
  const regexKBFull = /(?<=Коммерческий банк\s*(?:\(КБ\))?\s*|Коммерческого банка\s*(?:\(КБ\))?\s*)«.*?»/;
  const regexKBShort = /(?<=КБ\s*)«.*?»/;

  // NP
  const regexNPFull =
    /(?<=Некоммерческое партнерство\s*(?:\(НП\))?\s*|Некоммерческого партнерства\s*(?:\(НП\))?\s*)«.*?»/;
  const regexNPShort = /(?<=НП\s*)«.*?»/;

  // SO
  const regexSOFull =
    /(?<=Саморегулируемая организация\s*(?:\(СРО\))?\s*|Саморегулируемой организации\s*(?:\(СРО\))?\s*)«.*?»/;
  const regexSOShort = /(?<=СРО\s*)«.*?»/;

  // ODO
  const regexODOFull =
    /(?<=Общество с дополнительной ответственностью\s*(?:\(ОДО\))?\s*|Общества с дополнительной ответственностью\s*(?:\(ОДО\))?\s*)«.*?»/;
  const regexODOShort = /(?<=ОДО\s*)«.*?»/;

  // PK
  const regexPKFull =
    /(?<=Производственный кооператив\s*(?:\(ПК\))?\s*|Производственного кооператива\s*(?:\(ПК\))?\s*)«.*?»/;
  const regexPKShort = /(?<=ПК\s*)«.*?»/;

  // POK
  const regexPOKFull =
    /(?<=Потребительский кооператив\s*(?:\(ПОК\))?\s*|Потребительского кооператива\s*(?:\(ПОК\))?\s*)«.*?»/;
  const regexPOKShort = /(?<=ПОК\s*)«.*?»/;

  // OO
  const regexOOFull = /(?<=Общественная организация\s*(?:\(ОО\))?\s*|Общественной организации\s*(?:\(ОО\))?\s*)«.*?»/;
  const regexOOShort = /(?<=ОО\s*)«.*?»/;

  // MUP
  const regexMUPFull =
    /(?<=Муниципальное унитарное предприятие\s*(?:\(МУП\))?\s*|Муниципального унитарного предприятия\s*(?:\(МУП\))?\s*)«.*?»/;
  const regexMUPShort = /(?<=МУП\s*)«.*?»/;

  // GBU
  const regexGBUFull =
    /(?<=Государственное бюджетное учреждение\s*(?:\(ГБУ\))?\s*|Государственного бюджетного учреждения\s*(?:\(ГБУ\))?\s*)«.*?»/;
  const regexGBUShort = /(?<=ГБУ\s*)«.*?»/;

  // MBU
  const regexMBUFull =
    /(?<=Муниципальное бюджетное учреждение\s*(?:\(МБУ\))?\s*|Муниципального бюджетного учреждения\s*(?:\(МБУ\))?\s*)«.*?»/;
  const regexMBUShort = /(?<=МБУ\s*)«.*?»/;

  text = findAndReplaceParties(inputString, companyMap, normilizedMap, regexOOOFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexOOOShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexPAOFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexPAOShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexZAOFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexZAOShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexOAOFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexOAOShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexAOFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexAOShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexGUPFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexGUPShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexFGUPFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexFGUPShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexKBFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexKBShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexNPFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexNPShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexSOFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexSOShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexODOFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexODOShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexPKFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexPKShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexPOKFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexPOKShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexOOFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexOOShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexMUPFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexMUPShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexGBUFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexGBUShort);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexMBUFull);
  text = findAndReplaceParties(text, companyMap, normilizedMap, regexMBUShort);

  return text;
};

export { replaceCompanyNames };
