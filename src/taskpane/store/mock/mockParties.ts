import { ContractPartieData } from "../../api/types";

export const mockContractType: string = "Договор подряда";

export const mockParties: ContractPartieData[] = [
  {
    name: "НазваниеКонтр",
    role: "Заказчик",
  },
  {
    name: "ИП ФИОИП",
    role: "Подрядчик",
  },
];
