import { useT } from "@/i18n/useT.js";

export default function ResultIdentity({ query, activeData, author, onGoToNames, onGoToOtherInfo }) {
  const t = useT();
  const kingdomAlert = activeData?.kingdom_inconsistencies;
  const rankAlert = activeData?.rank_inconsistencies;
  return (
    <>
      <div className="result-head">
        {activeData?.extinct && (
          <button type="button" className="id-badge id-badge-eteint id-badge-clickable" onClick={onGoToOtherInfo}>
            {t("identity.extinct_badge")}
          </button>
        )}
        <h2>
          <em>{activeData?.resolved_taxon || query.taxon}</em>
        </h2>
        {activeData && (
          <button
            type="button"
            className={
              "id-author" +
              (author.values.length === 0 ? " id-author-missing" : author.variants.size > 1 ? " id-author-conflict" : " id-author-ok")
            }
            onClick={onGoToNames}
            title={author.variants.size > 1 ? t("identity.author_conflict_title", { authors: [...author.variants].join(" / ") }) : undefined}
          >
            {author.values.length === 0 ? t("identity.author_unknown") : author.displayed}
          </button>
        )}
        {activeData?.kingdom && <span className="id-badge">{activeData.kingdom}</span>}
        {/*
           TODO(ecozone): ecozone badge. The data is not exposed in
           activeData yet; wire it here once the API and frontend
           provide it.
         */}
        {activeData?.vernacular_names?.length > 0 && (
          <button type="button" className="id-vernacular id-vernacular-clickable" onClick={onGoToNames}>
            {activeData.vernacular_names[0]}
            {activeData.vernacular_names.length > 1 ? "…" : ""}
          </button>
        )}
      </div>
      {kingdomAlert?.length > 0 && (
        <div className="regne-alert">
          <p className="regne-alert-title">
            {t("identity.kingdom_alert_title", { count: kingdomAlert.length })}
          </p>
          <ul>
            {kingdomAlert.map((inc, i) => (
              <li key={i}>
                <strong>{inc.module.toUpperCase()}</strong>{" "}
                {t("identity.kingdom_alert_item", { suggested: inc.suggested_kingdom, retained: inc.retained_kingdom })}
              </li>
            ))}
          </ul>
          <p className="regne-alert-hint">
            {t("identity.kingdom_alert_hint")}
          </p>
        </div>
      )}
      {rankAlert?.length > 0 && (
        <div className="regne-alert">
          <p className="regne-alert-title">
            {t("identity.rank_alert_title", { count: rankAlert.length })}
          </p>
          <ul>
            {rankAlert.map((inc, i) => (
              <li key={i}>
                <strong>{inc.module.toUpperCase()}</strong>{" "}
                {t("identity.rank_alert_item", { suggested: inc.suggested_value, field: inc.compared_field, retained: inc.retained_value })}
              </li>
            ))}
          </ul>
          <p className="regne-alert-hint">
            {t("identity.rank_alert_hint")}
          </p>
        </div>
      )}
    </>
  );
}
