import { InsertPlaceEnum, LevelOfCriticalEnum } from "../enums/suggestion";

export type SuggestionT = {
  id: string;
  levelOfCriticality: LevelOfCriticalEnum;
  // targetText: string;
  change?: {
    isApplied?: boolean;
    target?: string;
    text?: string;
    place?: InsertPlaceEnum;
  };
  note?: {
    isApplied?: boolean;
    target?: string;
    text?: string;
  };
};
