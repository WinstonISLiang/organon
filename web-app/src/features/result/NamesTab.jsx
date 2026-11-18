import { useT } from "@/i18n/useT.js";
import { groupSourcesByValue, mergeAdjacentEqual } from "@/shared/rankComparison.js";
import { normalizeAuthor } from "@/shared/useAuthorChoice.js";

function AuthorCard({ activeData, availableSources, author }) {
  const t = useT();
  const valueFor = (m) => {
    const candidate = activeData.author_candidates[m.id];
    return candidate ? normalizeAuthor(candidate) : "—";
  };
  const orderedSources = groupSourcesByValue(availableSources, valueFor);
  const recommendedSource = orderedSources.find(
    (m) => valueFor(m) === normalizeAuthor(activeData.consolidated_author)
  )?.id;
  const chosenSourceId = author.sourceOverride ?? recommendedSource ?? null;
  const groups = mergeAdjacentEqual(orderedSources, valueFor);
  return (
    <div className="data-table-wrap classification-compare-wrap">
      <table className="data-table classification-compare-table">
        <thead>
          <tr>
            {orderedSources.map((m) => (
              <th key={m.id}>
                <button
                  type="button"
                  className={"id-badge id-badge-btn" + (chosenSourceId === m.id ? " on" : "")}
                  onClick={() => author.chooseSource(m.id)}
                  title={m.id === recommendedSource ? t("names.author_recommended") : t("names.author_choose")}
                >
                  {m.id.toUpperCase()}
                  {m.id === recommendedSource ? " ★" : ""}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {groups.map((g, gi) => {
              const isChosen = g.sources.some((m) => m.id === chosenSourceId);
              return (
                <td key={gi} colSpan={g.sources.length} className={isChosen ? "chosen-col" : undefined}>
                  {g.value}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function NamesTab({ activeData, availableSources, author }) {
  const t = useT();
  return (
    <div className="panel">
      <div className="panel-head">
        <span className="t">{t("names.title")}</span>
      </div>
      {!activeData ? (
        <p className="panel-empty">{t("names.empty")}</p>
      ) : (
        <>
          <div className="noms-card">
            <div className="noms-card-head">
              <span className="noms-card-title">{t("names.author")}</span>
              <small className="noms-card-hint">{t("names.author_hint")}</small>
            </div>
            {activeData.consolidated_author ? (
              <AuthorCard activeData={activeData} availableSources={availableSources} author={author} />
            ) : (
              <p className="panel-empty">{t("names.author_none")}</p>
            )}
          </div>

          <div className="noms-card">
            <div className="noms-card-head">
              <span className="noms-card-title">{t("names.vernacular")}</span>
            </div>
            {activeData.vernacular_names.length > 0 ? (
              <p className="noms-card-body">{activeData.vernacular_names.join(", ")}</p>
            ) : (
              <p className="panel-empty">{t("names.vernacular_none")}</p>
            )}
          </div>

          {Object.values(activeData.vernacular_names_without_language || {}).some((names) => names.length > 0) && (
            <div className="noms-card">
              <div className="noms-card-head">
                <span className="noms-card-title">{t("names.vernacular_no_language")}</span>
              </div>
              {Object.entries(activeData.vernacular_names_without_language).map(([module, names]) => (
                <div key={module} className="autres-noms-groupe">
                  <p className="autres-noms-statut">{module.toUpperCase()}</p>
                  <p className="noms-card-body">{names.join(", ")}</p>
                </div>
              ))}
            </div>
          )}

          {Object.entries(activeData.other_names || {}).some(([, names]) => names.length > 0) && (
            <div className="noms-card">
              <div className="noms-card-head">
                <span className="noms-card-title">{t("names.other_names")}</span>
              </div>
              {Object.entries(activeData.other_names).map(([status, names]) => (
                names.length > 0 && (
                  <div key={status} className="autres-noms-groupe">
                    <p className="autres-noms-statut">{status}</p>
                    <p className="noms-card-body">{names.join(", ")}</p>
                  </div>
                )
              ))}
            </div>
          )}

          <div className="noms-card">
            <div className="noms-card-head">
              <span className="noms-card-title">
                {activeData.synonyms_source
                  ? t("names.synonyms_with_source", { source: activeData.synonyms_source.toUpperCase() })
                  : t("names.synonyms")}
              </span>
            </div>
            {activeData.synonyms.length > 0 ? (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t("names.col_name")}</th>
                      <th>{t("names.col_author")}</th>
                      <th>{t("names.col_rank")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeData.synonyms.map((s, i) => (
                      <tr key={i}>
                        <td><em>{s.name}</em></td>
                        <td>{s.author || "—"}</td>
                        <td>{s.rank || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="panel-empty">{t("names.synonyms_none")}</p>
            )}
          </div>

          <div className="noms-card">
            <div className="noms-card-head">
              <span className="noms-card-title">{t("names.basionym")}</span>
            </div>
            {activeData.basionym ? (
              <p className="noms-card-body">
                <em>{activeData.basionym.name}</em>
                {activeData.basionym.author ? ` ${activeData.basionym.author}` : ""}{" "}
                <span className="id-badge">{activeData.basionym.source.toUpperCase()}</span>
              </p>
            ) : (
              <p className="panel-empty">{t("names.basionym_none")}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
