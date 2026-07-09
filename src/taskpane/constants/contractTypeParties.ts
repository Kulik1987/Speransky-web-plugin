import { ALL_CONTRACT_TYPES } from "./contracts";
import { ALL_PARTIES } from "./parties";

const PARTY_GROUPS = {
  sale: ["Продавец", "Покупатель"],
  supply: ["Поставщик", "Покупатель"],
  lease: ["Арендодатель", "Арендатор"],
  leasing: ["Лизингодатель", "Лизингополучатель"],
  contractWork: ["Заказчик", "Подрядчик", "Субподрядчик"],
  services: ["Заказчик", "Исполнитель"],
  carriage: ["Перевозчик", "Грузоотправитель"],
  forwarding: ["Экспедитор", "Клиент"],
  loan: ["Займодавец", "Заёмщик"],
  credit: ["Кредитор", "Заёмщик"],
  factoring: ["Финансовый агент", "Клиент"],
  storage: ["Хранитель", "Поклажедатель"],
  insurance: ["Страховщик", "Страхователь"],
  mandate: ["Доверитель", "Поверенный"],
  commission: ["Комитент", "Комиссионер"],
  agency: ["Принципал", "Агент"],
  trustManagement: ["Учредитель управления", "Доверительный управляющий"],
  pledge: ["Залогодатель", "Залогодержатель"],
  suretyship: ["Поручитель", "Кредитор"],
  guarantee: ["Гарант", "Бенефициар"],
  cession: ["Цедент", "Цессионарий"],
  license: ["Лицензиар", "Лицензиат"],
  ipAssignment: ["Правообладатель", "Приобретатель"],
  authorOrder: ["Автор", "Заказчик"],
  franchise: ["Франчайзер", "Франчайзи"],
  employment: ["Работодатель", "Работник"],
  nda: ["Раскрывающая сторона", "Получающая сторона"],
} satisfies Record<string, string[]>;

const GENERIC_PARTIES = ["Сторона 1", "Сторона 2"];

const CONTRACT_TYPE_PARTIES: Record<string, string[]> = {
  // Аренда и лизинг
  "Договор аренды недвижимости": PARTY_GROUPS.lease,
  "Договор аренды транспортного средства": PARTY_GROUPS.lease,
  "Договор аренды оборудования": PARTY_GROUPS.lease,
  "Договор лизинга": PARTY_GROUPS.leasing,
  "Договор субаренды": PARTY_GROUPS.lease,
  // Купля-продажа
  "Договор купли-продажи недвижимости": PARTY_GROUPS.sale,
  "Договор купли-продажи доли в ООО": PARTY_GROUPS.sale,
  "Договор купли-продажи товаров": PARTY_GROUPS.sale,
  "Договор купли-продажи ценных бумаг": PARTY_GROUPS.sale,
  "Предварительный договор купли-продажи": PARTY_GROUPS.sale,
  // Услуги и работы
  "Договор оказания услуг": PARTY_GROUPS.services,
  "Договор оказания юридических услуг": PARTY_GROUPS.services,
  "Договор оказания медицинских услуг": PARTY_GROUPS.services,
  "Договор подряда": PARTY_GROUPS.contractWork,
  "Договор строительного подряда": PARTY_GROUPS.contractWork,
  "Договор субподряда": PARTY_GROUPS.contractWork,
  "Трудовой договор": PARTY_GROUPS.employment,
  "Договор о дистанционной работе": PARTY_GROUPS.employment,
  // Поставка и логистика
  "Договор поставок": PARTY_GROUPS.supply,
  "Договор транспортной экспедиции": PARTY_GROUPS.forwarding,
  "Договор перевозки груза": PARTY_GROUPS.carriage,
  "Договор хранения": PARTY_GROUPS.storage,
  // Финансы и кредит
  "Договор займа": PARTY_GROUPS.loan,
  "Кредитный договор": PARTY_GROUPS.credit,
  "Договор залога": PARTY_GROUPS.pledge,
  "Договор поручительства": PARTY_GROUPS.suretyship,
  "Договор банковской гарантии": PARTY_GROUPS.guarantee,
  "Договор факторинга": PARTY_GROUPS.factoring,
  "Инвестиционный договор": [],
  // Интеллектуальная собственность
  "Лицензионный договор": PARTY_GROUPS.license,
  "Договор об отчуждении исключительного права": PARTY_GROUPS.ipAssignment,
  "Договор авторского заказа": PARTY_GROUPS.authorOrder,
  "Договор разработки программного обеспечения": [],
  // Корпоративные
  "Акционерное соглашение": [],
  "Корпоративный договор": [],
  "Договор о совместной деятельности": [],
  // Агентские и комиссия
  "Агентский договор": PARTY_GROUPS.agency,
  "Договор комиссии": PARTY_GROUPS.commission,
  "Договор поручения": PARTY_GROUPS.mandate,
  "Договор доверительного управления": PARTY_GROUPS.trustManagement,
  "Договор франчайзинга": PARTY_GROUPS.franchise,
  // Уступка и расчёты
  "Договор цессии": PARTY_GROUPS.cession,
  "Соглашение о зачёте взаимных требований": [],
  "Соглашение об отступном": [],
  "Мировое соглашение": [],
  // Конфиденциальность и сотрудничество
  "Соглашение о конфиденциальности (NDA)": PARTY_GROUPS.nda,
  "Соглашение о намерениях (LOI)": [],
  "Соглашение о сотрудничестве": [],
  "Соглашение о неконкуренции": [],
  // Страхование
  "Договор страхования имущества": PARTY_GROUPS.insurance,
  "Договор страхования ответственности": PARTY_GROUPS.insurance,
  "Договор страхования жизни": PARTY_GROUPS.insurance,
};

/** @description Получение сторон, соответствующих типу договора */
export const getPartiesForContractType = (contractType: string): string[] => {
  const specificParties = CONTRACT_TYPE_PARTIES[contractType];
  if (specificParties === undefined) return ALL_PARTIES;
  return ["Все стороны", ...specificParties, ...GENERIC_PARTIES];
};

/** @description Получение типов договоров, соответствующих выбранной стороне */
export const getContractTypesForParty = (party: string): string[] => {
  const matchingTypes = ALL_CONTRACT_TYPES.filter((type) => CONTRACT_TYPE_PARTIES[type]?.includes(party));
  return matchingTypes.length > 0 ? matchingTypes : ALL_CONTRACT_TYPES;
};
