// Dev-server only page (not part of the build): mounts the i18n socle
// with every locale enabled, independently of ENABLED_LOCALES in the app.
import { createRoot } from "react-dom/client";

import { I18nProvider } from "@/i18n/I18nProvider.jsx";
import Probe from "./Probe.jsx";

createRoot(document.getElementById("root")).render(
  <I18nProvider enabledLocales={["fr", "en"]}>
    <Probe />
  </I18nProvider>,
);
