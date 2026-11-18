import { useT } from "@/i18n/useT.js";
import DataTab from "./DataTab.jsx";
import { ModuleStatusIcon } from "./ModuleStatus.jsx";
import NamesTab from "./NamesTab.jsx";
import OtherInfoTab from "./OtherInfoTab.jsx";
import WikidataPanel from "@/features/wikidata/WikidataPanel.jsx";
import WikitextTab from "@/features/wikitext/WikitextTab.jsx";

// Tabs of the side-navigation shell of the result, in display order.
const RESULT_VIEWS = [
  { id: "wikitext", labelKey: "result.tab_wikipedia" },
  { id: "wiktionary", labelKey: "result.tab_wiktionary" },
  { id: "wikidata", labelKey: "result.tab_wikidata" },
  { id: "wikispecies", labelKey: "result.tab_wikispecies" },
  { id: "data", labelKey: "result.tab_data" },
];

// Projects with no generation module yet: the tab exists, its content
// is to come.
const UNSUPPORTED_PROJECT_VIEWS = ["wiktionary", "wikispecies"];

// Result views shown under the "Wikipédia" side tab, after the wikitext
// sub-tabs in the same horizontal bar.
const WIKIPEDIA_GROUP_VIEWS = ["wikitext", "names", "other"];
const WIKITEXT_SUBTABS = [
  { id: "all", labelKey: "result.subtab_all" },
  { id: "taxobox", labelKey: "result.subtab_taxobox" },
  { id: "image", labelKey: "result.subtab_image" },
  { id: "subranks", labelKey: "result.subtab_subranks" },
  { id: "references", labelKey: "result.subtab_references" },
];
const EXTRA_SUBTABS = [
  { id: "names", labelKey: "result.subtab_names" },
  { id: "other", labelKey: "result.subtab_other" },
];

export default function ResultPanel({
  view,
  onChangeView,
  wikitextSubTab,
  onChangeWikitextSubTab,
  tracking,
  facets,
  subtaxa,
  references,
  author,
  wikitext,
  commonsImages,
  commonsTaxon,
  collapsedBoxes,
  onToggleBox,
  onChooseTaxoboxSource,
  diagnosis,
  query,
}) {
  const t = useT();
  const { activeSource, activeEntry, activeData } = tracking;
  const inWikipediaGroup = WIKIPEDIA_GROUP_VIEWS.includes(view);
  return (
    <div className="result-shell">
      <nav className="result-nav" role="tablist" aria-label={t("result.nav_label")}>
        {RESULT_VIEWS.map(({ id, labelKey }) => {
          const on = id === "wikitext" ? inWikipediaGroup : view === id;
          return (
            <button
              key={id}
              type="button"
              id={`nav-tab-${id}`}
              role="tab"
              aria-selected={on}
              className={"tab" + (on ? " on" : "")}
              onClick={() => onChangeView(id)}
            >
              {t(labelKey)}
              {(id === "wikitext" || id === "data") && !tracking.submitError && tracking.hasPending && <ModuleStatusIcon status="running" />}
            </button>
          );
        })}
      </nav>

      <div className="result-panel-wrap" role="tabpanel" aria-labelledby={`nav-tab-${view}`}>
        {activeData && inWikipediaGroup && (
          <div className="tabs subtabs" role="tablist" aria-label={t("result.subnav_label")}>
            {WIKITEXT_SUBTABS.map(({ id, labelKey }) => {
              const on = view === "wikitext" && wikitextSubTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  className={"tab" + (on ? " on" : "")}
                  onClick={() => {
                    onChangeView("wikitext");
                    onChangeWikitextSubTab(id);
                  }}
                >
                  {t(labelKey)}
                </button>
              );
            })}
            {EXTRA_SUBTABS.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                className={"tab" + (view === id ? " on" : "")}
                onClick={() => onChangeView(id)}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        )}

        {view === "wikitext" && (
          <WikitextTab
            activeSource={activeSource}
            activeEntry={activeEntry}
            activeData={activeData}
            activeSubTab={wikitextSubTab}
            facets={facets}
            subtaxa={subtaxa}
            references={references}
            wikitext={wikitext}
            commonsImages={commonsImages}
            commonsTaxon={commonsTaxon}
            collapsedBoxes={collapsedBoxes}
            onToggleBox={onToggleBox}
            onChooseTaxoboxSource={onChooseTaxoboxSource}
          />
        )}

        {view === "names" && (
          <NamesTab activeData={activeData} availableSources={facets.availableSources} author={author} />
        )}

        {view === "other" && <OtherInfoTab activeData={activeData} />}

        {view === "wikidata" && <WikidataPanel diagnosis={diagnosis} />}

        {UNSUPPORTED_PROJECT_VIEWS.includes(view) && (
          <div className="panel">
            <p className="panel-empty">{t("result.unsupported")}</p>
          </div>
        )}

        {view === "data" && (
          <DataTab
            activeSource={activeSource}
            activeEntry={activeEntry}
            activeData={activeData}
            onRetryModule={(moduleId) => tracking.retryModule(query, moduleId)}
          />
        )}
      </div>
    </div>
  );
}
