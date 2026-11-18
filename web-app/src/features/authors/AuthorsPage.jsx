import { useT } from "@/i18n/useT.js";

export default function AuthorsPage({ onBack }) {
  const t = useT();
  return (
    <div className="sources-page">
      <button type="button" className="back-link" onClick={onBack}>
        ‹ {t("common.back")}
      </button>

      <h1>{t("authors.title")}</h1>

      <section className="authors-entry">
        <h2>Organon</h2>

        <p>{t("authors.organon_intro")}</p>
        <p>
          <a
            href="https://fr.wikipedia.org/wiki/Utilisateur:LD"
            target="_blank"
            rel="noopener noreferrer"
          >
            LD
          </a> {t("authors.organon_developer_after")}
        </p>
      </section>

      <section className="authors-entry">
        <h2>
          <a
            href="https://fr.wikipedia.org/wiki/Projet:Biologie/Taxobot"
            target="_blank"
            rel="noopener noreferrer"
          >
            Taxobot
          </a>
        </h2>

        <p>
          {t("authors.taxobot_before")}{" "}
          <a
            href="https://fr.wikipedia.org/wiki/Utilisateur:Hexasoft"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hexasoft
          </a>{" "}
          {t("authors.taxobot_middle")}{" "}
          <a
            href="https://fr.wikipedia.org/wiki/Utilisateur:LD"
            target="_blank"
            rel="noopener noreferrer"
          >
            LD
          </a>
          {t("authors.taxobot_after")}
        </p>
      </section>

      <section className="authors-entry">
        <h2>{t("authors.wikipedia_title")}</h2>

        <p>
          {t("authors.wikipedia_before")}{" "}
          <a
            href="https://fr.wikipedia.org/wiki/Discussion_Projet:Biologie/Le_caf%C3%A9_des_biologistes"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("authors.wikipedia_link")}
          </a>{" "}
          {t("authors.wikipedia_after")}
        </p>
      </section>

      <section className="authors-entry">
        <h2>Favicon</h2>

        <p>
          {t("authors.favicon_before")}{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Greek_uc_omicron.svg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Greek_uc_omicron.svg
          </a>{" "}
          {t("authors.favicon_middle")}{" "}
          <a
            href="https://commons.wikimedia.org/wiki/User:Mrmw"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mrmw
          </a>
          {t("authors.favicon_after")}
        </p>
      </section>
    </div>
  );
}