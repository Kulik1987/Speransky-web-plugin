/* global */

import React from "react";
import Auth from "./auth";
import Config from "./config";
import Menu from "./menu";
import Document from "./document";
import Suggestions from "./suggestions";

class RootStore {
  authStore: Auth;
  configStore: Config;
  documentStore: Document;
  menuStore: Menu;
  suggestionsStore: Suggestions;

  constructor() {
    this.authStore = new Auth(this);
    this.configStore = new Config(this);
    this.documentStore = new Document(this);
    this.menuStore = new Menu(this);
    this.suggestionsStore = new Suggestions(this);
  }
}

const StoresContext = React.createContext<RootStore>(new RootStore());

export const useStores = (): RootStore => React.useContext(StoresContext);

export default RootStore;
