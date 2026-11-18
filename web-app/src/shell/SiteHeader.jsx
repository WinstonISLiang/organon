import { LOGIN_URL } from "@/api/client.js";
import LanguageSelector from "@/i18n/LanguageSelector.jsx";
import { useT } from "@/i18n/useT.js";
import { PreferencesToggleButton } from "./StoragePreferencesBanner.jsx";

// Username returned by /auth/me when ORGANON_DEV=1 (organon/api/deps.py).
const DEV_USERNAME = "Utilisateur de développement";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
    </svg>
  );
}

export default function SiteHeader({
  username,
  onLogout,
  availableSourceCount,
  onShowSources,
  theme,
  onToggleTheme,
  storageConsent,
  onShowPreferences,
}) {
  const t = useT();
  return (
    <header>
      <div className="wrap topbar">
        <div className="brand">
          {username ? (
            <span className="auth-status">
              {username === DEV_USERNAME ? t("header.dev_username") : username} ·{" "}
              <button type="button" className="footer-link" onClick={onLogout}>
                {t("header.sign_out")}
              </button>
            </span>
          ) : (
            <a className="footer-link" href={LOGIN_URL}>
              {t("header.sign_in")}
            </a>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button type="button" className="status" onClick={onShowSources}>
            <span className="live">
              {typeof availableSourceCount === "number"
                ? t("sources.available", { count: availableSourceCount })
                : t("header.sources_unknown")}
            </span>
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={t("header.theme_toggle")}
            title={t("header.theme_toggle_title")}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <LanguageSelector />
          <PreferencesToggleButton consent={storageConsent} onClick={onShowPreferences} />
        </div>
      </div>
    </header>
  );
}
