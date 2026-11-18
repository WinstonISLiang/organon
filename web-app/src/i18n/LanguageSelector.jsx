import { LOCALE_NAMES } from "./locales.js";
import { useLocale, useT } from "./useT.js";

// Mounted in SiteHeader; renders nothing while a single locale is enabled.
export default function LanguageSelector() {
  const t = useT();
  const { locale, enabledLocales, setLocale } = useLocale();
  if (enabledLocales.length < 2) return null;
  return (
    <select
      className="status"
      value={locale}
      onChange={(event) => setLocale(event.target.value)}
      aria-label={t("language.label")}
    >
      {enabledLocales.map((code) => (
        <option key={code} value={code} lang={code}>
          {LOCALE_NAMES[code] ?? code}
        </option>
      ))}
    </select>
  );
}
