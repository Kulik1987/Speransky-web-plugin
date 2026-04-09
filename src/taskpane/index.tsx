/* global document, Office, module, require */
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { FluentProvider } from "@fluentui/react-components";
import { lightTheme } from "./theme/theme";

const rootElement: HTMLElement = document.getElementById("container");
const root = createRoot(rootElement);

/* Render application after Office initializes */
Office.onReady(() => {
  root.render(
    <FluentProvider theme={lightTheme}>
      <App />
    </FluentProvider>
  );
});

if ((module as any).hot) {
  (module as any).hot.accept("./app/App", () => {
    const NextApp = require("./app/App").default;
    root.render(NextApp);
  });
}
