import { Fragment, useEffect, useMemo, useState } from "react";
import { apiErrorMessage, fetchSources } from "@/api/client.js";
import { useLocale, useT } from "@/i18n/useT.js";

// Tags recurring in most sources ("common") vs mentions specific to one
// source ("specific"). `startsWith` covers qualified variants (e.g.
// "identifiant Wikidata (QID)"): the parenthesized nuance is lost, but
// the source must stay tagged as providing that item. Each common tag
// has its own color (see index.css, palette inspired by Wikimedia
// Codex) to stay scannable with several tags per row.
const FREQUENT_ELEMENTS = [
  { labelKey: "sources.element.author", css: "chip-auteur", test: (s) => s.toLowerCase() === "auteur" },
  { labelKey: "sources.element.rank", css: "chip-rang", test: (s) => s.toLowerCase() === "rang" },
  { labelKey: "sources.element.kingdom", css: "chip-regne", test: (s) => s.toLowerCase() === "règne" },
  { labelKey: "sources.element.classification_chain", css: "chip-classif", test: (s) => s.toLowerCase().startsWith("chaîne de classification") },
  { labelKey: "sources.element.vernacular_names", css: "chip-vernac", test: (s) => s.toLowerCase().startsWith("noms vernaculaires") },
  { labelKey: "sources.element.synonyms", css: "chip-syno", test: (s) => s.toLowerCase() === "synonymes" },
  { labelKey: "sources.element.subtaxa", css: "chip-sst", test: (s) => s.toLowerCase() === "sous-taxons" },
  { labelKey: "sources.element.basionym", css: "chip-basio", test: (s) => s.toLowerCase() === "basionyme" },
  { labelKey: "sources.element.extinct", css: "chip-eteint", test: (s) => s.toLowerCase() === "éteint" },
  { labelKey: "sources.element.identifier", css: "chip-ident", test: (s) => s.toLowerCase().startsWith("identifiant") },
  { labelKey: "sources.element.other_projects", css: "chip-projets", test: (s) => s.toLowerCase() === "autres projets" },
];

// Grouping of "Méthode d'accès" to make it sortable; follows
// access.type, a backend enumeration (see
// organon/core/db_inventory.py). The raw detail ("API REST/JSON
// (checklistbank.org, dataset 3LXR...)") is redundant once this marker
// is shown; it stays in a hover tooltip rather than clutter the cell
// again.
const ACCESS_GROUPS = [
  { labelKey: "sources.access.api_rest", test: (s) => s.access.type === "api_rest" },
  { labelKey: "sources.access.soap", test: (s) => s.access.type === "soap" },
  { labelKey: "sources.access.scraping", test: (s) => s.access.type === "scraping" },
  { labelKey: "sources.access.verification_http", test: (s) => s.access.type === "verification_http" },
  { labelKey: "sources.access.export", test: (s) => s.access.type === "export" },
  { labelKey: "sources.access.contact_requis", test: (s) => s.access.type === "contact_requis" },
];

function accessGroupLabel(source, t) {
  const group = ACCESS_GROUPS.find((g) => g.test(source));
  return t(group ? group.labelKey : "sources.access.other");
}

// A source may cover several distinct sites or usages under one module
// (same id, status and access): e.g. the `externe` module covers
// Wikidata, Commons, Wikispecies, Wiktionary and fr.wikipedia.org. The
// per-site detail then comes from `source.facets` (db_inventory.yaml),
// not from a deduction on the text of `harvested_items`: one row per
// facet, with its own name and url and the rest inherited from the
// parent source.
function expandParts(source) {
  if (!source.facets?.length) return [source];
  return source.facets.map((part, i) => ({
    ...source,
    id: `${source.id}-${i}`,
    name: part.name,
    url: part.url,
    harvested_items: part.harvested_items,
  }));
}

function splitElements(list) {
  const common = [];
  const specific = [];
  for (const raw of list) {
    const hit = FREQUENT_ELEMENTS.find((f) => f.test(raw));
    if (hit) {
      if (!common.includes(hit)) common.push(hit);
    } else {
      specific.push(raw);
    }
  }
  return { common, specific };
}

// API status codes (kept as returned) with a translated tooltip.
const STATUS_CODES = [
  "en_attente",
  "non_sonde",
  "bloque_temporaire",
  "bloque",
  "contact_requis",
  "mort",
  "ecarte",
  "retire",
  "hors_perimetre",
];

function statusLabel(status, t) {
  return STATUS_CODES.includes(status) ? t(`sources.status.${status}`) : status;
}

// "2026-01-31" -> dd-mm-yyyy in French, yyyy-mm-dd in English (see
// sources.date_format).
function formatDate(iso, t) {
  const [year, month, day] = iso.split("-");
  return t("sources.date_format", { day, month, year });
}

function SourceName({ source }) {
  const t = useT();
  const label = source.is_default ? `${source.name} (${t("sources.default_suffix")})` : source.name;
  if (!source.url) return <span>{label}</span>;
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

function ClassificationCell({ classification }) {
  const t = useT();
  if (!classification.can_classify) {
    return <span className="source-muted">{t("common.no")}</span>;
  }
  return (
    <span>
      {t("common.yes")}
      {classification.estimated && <span className="source-badge source-badge-warn">{t("sources.estimated")}</span>}
    </span>
  );
}

function SourcesHeader({ onBack, children }) {
  const t = useT();
  return (
    <div className="sources-page">
      <button type="button" className="back-link" onClick={onBack}>
        ‹ {t("common.back")}
      </button>
      <span className="eyebrow">{t("sources.back_eyebrow")}</span>
      {children}
    </div>
  );
}

function sortComparator(key, dir) {
  return (a, b) => {
    const av = key === "commonCount" ? a[key] : String(a[key]).toLowerCase();
    const bv = key === "commonCount" ? b[key] : String(b[key]).toLowerCase();
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return a.name.localeCompare(b.name);
  };
}

function SortableHeader({ label, sortKey, sort, onSort }) {
  const active = sort.key === sortKey;
  return (
    <th className="sortable" aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button type="button" onClick={() => onSort(sortKey)} className={active ? "sort-active" : ""}>
        {label} <span className="sort-arrow">{active ? (sort.dir === 1 ? "▲" : "▼") : ""}</span>
      </button>
    </th>
  );
}

export default function SourcesPage({ onBack }) {
  const t = useT();
  const { locale } = useLocale();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState({ key: "name", dir: 1 });
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    let cancelled = false;
    fetchSources()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    if (!data) return null;

    const categories = data.categories
      .map((category) => ({
        name: category.name,
        sources: category.sources.filter((s) => s.status === "disponible").flatMap(expandParts),
      }))
      .filter((category) => category.sources.length > 0);

    return categories.map((category) => ({
      name: category.name,
      sources: category.sources.map((s) => {
        const { common, specific } = splitElements(s.harvested_items);
        return {
          ...s,
          category: category.name,
          common,
          specific,
          commonCount: common.length,
          accessGroup: accessGroupLabel(s, t),
        };
      }),
    }));
  }, [data, t]);

  const unavailable = useMemo(() => {
    if (!data) return [];
    return data.categories.flatMap((category) => category.sources).filter((s) => s.status !== "disponible");
  }, [data]);

  // "retire" = integrated for a while then deliberately unplugged (see
  // the status semantics in db_inventory.yaml): never "considered" like
  // the other unavailable ones (never evaluated, discarded...), so
  // counted and listed apart.
  const archived = useMemo(
    () => unavailable.filter((s) => s.status === "retire").sort((a, b) => a.name.localeCompare(b.name, locale)),
    [unavailable, locale]
  );
  const considered = useMemo(
    () => unavailable.filter((s) => s.status !== "retire").sort((a, b) => a.name.localeCompare(b.name, locale)),
    [unavailable, locale]
  );

  if (error) {
    return (
      <SourcesHeader onBack={onBack}>
        <p className="panel-empty">{t("sources.load_error", { error: apiErrorMessage(error, t) })}</p>
      </SourcesHeader>
    );
  }

  if (!data || !grouped) {
    return (
      <SourcesHeader onBack={onBack}>
        <p className="panel-loading">{t("sources.loading")}</p>
      </SourcesHeader>
    );
  }

  // Number of "disponible" yaml entries before the split into facets
  // (see `grouped` above); otherwise the title would grow as soon as a
  // multi-facet source (e.g. `externe`) shows on several rows,
  // unrelated to the real number of distinct modules. Same count as the
  // header badge (App.jsx), so both numbers always match.
  const totalAvailable = data.categories.reduce(
    (n, c) => n + c.sources.filter((s) => s.status === "disponible").length,
    0
  );
  const cmp = sortComparator(sort.key, sort.dir);

  function handleSort(key) {
    setSort((prev) => ({
      key,
      dir: prev.key === key ? -prev.dir : key === "commonCount" ? -1 : 1,
    }));
  }

  function toggleGroup(category) {
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }));
  }

  return (
    <SourcesHeader onBack={onBack}>
      <h1>{t("sources.available", { count: totalAvailable })}</h1>
      <p className="sources-updated">{t("sources.updated", { date: formatDate(data.last_updated, t) })}</p>

      <section className="sources-section">
        <h2>{t("sources.section_available")}</h2>
        <p className="section-sub">
          {t("sources.section_sub")}
        </p>

        <div className="color-legend">
          <span className="color-legend-title">{t("sources.legend_title")}</span>
          {FREQUENT_ELEMENTS.map((f) => (
            <span key={f.css} className={`chip ${f.css}`}>
              {t(f.labelKey)}
            </span>
          ))}
        </div>

        <div className="table-scroll">
          <table className="sources-table">
            <thead>
              <tr>
                <SortableHeader label={t("sources.col_source")} sortKey="name" sort={sort} onSort={handleSort} />
                <SortableHeader label={t("sources.col_classification")} sortKey="classif" sort={sort} onSort={handleSort} />
                <SortableHeader label={t("sources.col_common")} sortKey="commonCount" sort={sort} onSort={handleSort} />
                <th>{t("sources.col_specific")}</th>
                <SortableHeader label={t("sources.col_access")} sortKey="accessGroup" sort={sort} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {grouped.map((category) => {
                const isCollapsed = !!collapsed[category.name];
                const rows = [...category.sources]
                  .map((s) => ({ ...s, classif: s.classification.can_classify ? (s.classification.estimated ? `${t("common.yes")} (${t("sources.estimated")})` : t("common.yes")) : t("common.no") }))
                  .sort(cmp);
                return (
                  <Fragment key={category.name}>
                    <tr
                      className={`group-head${isCollapsed ? " collapsed" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-expanded={!isCollapsed}
                      onClick={() => toggleGroup(category.name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleGroup(category.name);
                        }
                      }}
                    >
                      <td colSpan={5}>
                        <span className="group-toggle">
                          <span className="group-chev">▾</span>
                          {category.name}
                        </span>
                        <span className="group-count">
                          {" "}
                          {t("sources.group_count", { count: rows.length })}
                        </span>
                      </td>
                    </tr>
                    {!isCollapsed &&
                      rows.map((source) => (
                        <tr key={source.id}>
                          <td>
                            <SourceName source={source} />
                          </td>
                          <td>
                            <ClassificationCell classification={source.classification} />
                          </td>
                          <td>
                            {source.common.length ? (
                              <div className="chip-row">
                                {source.common.map((c) => (
                                  <span key={c.css} className={`chip ${c.css}`}>
                                    {t(c.labelKey)}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="none-cell">—</span>
                            )}
                          </td>
                          <td>
                            {source.specific.length ? (
                              source.specific.map((sp) => (
                                <span key={sp} className="specifique-text">
                                  {sp}
                                </span>
                              ))
                            ) : (
                              <span className="none-cell">—</span>
                            )}
                          </td>
                          <td>
                            <span className="access-chip" title={source.access.detail}>
                              {source.accessGroup}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sources-section">
        <h2>{t("sources.section_unavailable")}</h2>
        <div className="considered-list">
          <p>
            {t("sources.considered", { count: considered.length })}{" "}
            {considered.map((s, i) => (
              <span key={s.id}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" title={statusLabel(s.status, t)}>
                    {s.name}
                  </a>
                ) : (
                  <span title={statusLabel(s.status, t)}>{s.name}</span>
                )}
                {i < considered.length - 1 && <span className="sep">, </span>}
              </span>
            ))}
          </p>
          {archived.length > 0 && (
            <p className="sources-archived">
              {t("sources.archived", { count: archived.length, names: archived.map((s) => s.name).join(", ") })}
            </p>
          )}
        </div>
      </section>
    </SourcesHeader>
  );
}
