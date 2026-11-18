import { useT } from "@/i18n/useT.js";

// Toolforge requires the footer to expose a bug report link,
// documentation, source code, license and author(s).
const LICENSE_URL = "https://www.gnu.org/licenses/gpl-3.0.html";
const BUG_REPORT_URL = "https://fr.wikipedia.org/wiki/Discussion_Projet:Biologie/Organon";
const REPO_URL = "https://github.com/LDWP/organon";
const DOCS_URL = "https://github.com/LDWP/organon/blob/master/README.md";
const API_DOCS_URL = "https://organon.toolforge.org/docs";

export default function SiteFooter({ onShowSources, onShowAuthors }) {
  const t = useT();
  return (
    <footer>
      <div className="wrap">
        <p className="footer-meta">
          Organon ·{" "}
          <a href={API_DOCS_URL} target="_blank" rel="noreferrer">api/v1</a>{" "}
          ·{" "}
          <button type="button" className="footer-link" onClick={onShowSources}>
            {t("footer.sources")}
          </button>{" "}
          ·{" "}
          <button type="button" className="footer-link" onClick={onShowAuthors}>
            {t("footer.authors")}
          </button>{" "}
          · <a href={LICENSE_URL} target="_blank" rel="noreferrer">GPL-3.0-or-later</a> ·{" "}
          <a href={REPO_URL} target="_blank" rel="noreferrer">{t("footer.source_code")}</a>{" "}
          ·{" "}
          <a href={DOCS_URL} target="_blank" rel="noreferrer">{t("footer.documentation")}</a>{" "}
          ·{" "}
          <a href={BUG_REPORT_URL} target="_blank" rel="noreferrer">{t("footer.report_bug")}</a>
        </p>
      </div>
    </footer>
  );
}
