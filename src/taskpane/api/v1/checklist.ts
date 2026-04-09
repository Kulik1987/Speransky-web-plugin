import axios from "../instanceAxios";
import { CHECKLIST_ROUTES } from "../routes";
import {
  PayloadChecklistAddRuleDto,
  PayloadChecklistCreateDto,
  PayloadChecklistUpdateDto,
  ResponseChecklistAddRuleDto,
  ResponseChecklistAllDto,
  ResponseChecklistCreateDto,
  ResponseChecklistDto,
} from "../types";

const checklist = {
  /** @description Возвращает список чек-листов текущего клиента */
  list: () => {
    return axios.get<ResponseChecklistAllDto>(CHECKLIST_ROUTES.checklists);
  },

  /** @description Возвращает чек-лист по ID вместе со всеми правилами */
  get: (checklist_id: string) => {
    return axios.get<ResponseChecklistDto>(CHECKLIST_ROUTES.checklistById(checklist_id));
  },

  /** @description Создаёт новый чек-лист для текущего клиента */
  create: (data: PayloadChecklistCreateDto) => {
    return axios.post<ResponseChecklistCreateDto>(CHECKLIST_ROUTES.checklists, data);
  },

  /** @description Обновляет чек-лист по ID (правила не затрагиваются) */
  update: (checklist_id: string, data: PayloadChecklistUpdateDto) => {
    return axios.patch(CHECKLIST_ROUTES.checklistById(checklist_id), data);
  },

  /** @description Удаляет чек-лист текущего клиента и все связанные правила */
  delete: (checklist_id: string) => {
    return axios.delete(CHECKLIST_ROUTES.checklistById(checklist_id));
  },

  /** @description Создаёт новое правило в чек-листе */
  addRule: (checklist_id: string, data: PayloadChecklistAddRuleDto) => {
    return axios.post<ResponseChecklistAddRuleDto>(CHECKLIST_ROUTES.rules(checklist_id), data);
  },

  /** @description Обновляет правило чек-листа */
  updateRule: (rule_id: string, data: PayloadChecklistAddRuleDto) => {
    return axios.patch(CHECKLIST_ROUTES.ruleById(rule_id), data);
  },

  /** @description Удаляет правило чек-листа */
  deleteRule: (rule_id: string) => {
    return axios.delete(CHECKLIST_ROUTES.ruleById(rule_id));
  },
};

export default checklist;
