import { useT } from "@/i18n/useT.js";
import ImageGallery from "./ImageGallery.jsx";
import ReferenceControls from "./ReferenceControls.jsx";
import SubtaxaControls from "./SubtaxaControls.jsx";
import TaxoboxControls from "./TaxoboxControls.jsx";

// Title (message key) of the "rendered" box under the controls of each
// read-only sub-tab, visually delimiting the wikitext block from the
// rest. "all" is absent: it is the full editable article, not a
// preview of an isolated block.
const RENDER_BOX_TITLES = {
  taxobox: "wikitext.render_taxobox",
  subranks: "wikitext.render_subranks",
  references: "wikitext.render_references",
};

function StatusBox({ children }) {
  return (
    <div className="render-box">
      <div className="panel-loading">
        <p>{children}</p>
      </div>
    </div>
  );
}

function WikitextEditorBox({ activeSubTab, wikitext }) {
  const t = useT();
  const editing = wikitext.editingSubTab === activeSubTab;
  return (
    <div className="render-box">
      <div className="render-box-header">
        <h4 className="render-box-title" id="wikitext-label">
          {activeSubTab === "all" ? t("wikitext.title") : t(RENDER_BOX_TITLES[activeSubTab])}
        </h4>
        <span className="render-box-actions">
          <button
            type="button"
            className="edit-btn"
            aria-pressed={editing}
            onClick={editing ? wikitext.stopEditing : () => wikitext.startEditing(activeSubTab)}
          >
            {editing ? t("wikitext.done") : t("wikitext.edit")}
          </button>
          <button type="button" className="edit-btn" onClick={() => wikitext.copy(wikitext.text)}>
            {wikitext.copied ? t("common.copied") : t("common.copy")}
          </button>
        </span>
      </div>
      <textarea
        className="wikitext"
        aria-labelledby="wikitext-label"
        spellCheck="false"
        readOnly={!editing}
        value={wikitext.text}
        onChange={editing ? (e) => wikitext.changeEditedText(activeSubTab, e.target.value) : undefined}
      />
    </div>
  );
}

export default function WikitextTab({
  activeSource,
  activeEntry,
  activeData,
  activeSubTab,
  facets,
  subtaxa,
  references,
  wikitext,
  commonsImages,
  commonsTaxon,
  collapsedBoxes,
  onToggleBox,
  onChooseTaxoboxSource,
}) {
  const t = useT();
  return (
    <div className="wikitexte-tab">
      {!activeEntry && activeSource && <StatusBox>{t("wikitext.waiting_prefetch", { source: activeSource.toUpperCase() })}</StatusBox>}

      {activeEntry?.status === "loading" && <StatusBox>{t("wikitext.querying", { source: activeSource?.toUpperCase() })}</StatusBox>}

      {activeEntry?.status === "error" && (
        <div className="render-box">
          <div className="panel-empty">{t("wikitext.no_data", { source: activeSource?.toUpperCase() })}</div>
        </div>
      )}

      {activeData && (
        <>
          {activeSubTab === "taxobox" && facets.availableSources.length > 0 && (
            <TaxoboxControls
              facets={facets}
              collapsed={collapsedBoxes.taxobox}
              onToggle={() => onToggleBox("taxobox")}
              onChooseSource={onChooseTaxoboxSource}
            />
          )}

          {activeSubTab === "image" && (
            <div className="render-box">
              <ImageGallery
                taxon={commonsTaxon}
                selectedFileName={wikitext.selectedCommonsImage}
                onSelect={wikitext.selectCommonsImage}
                onDeselect={wikitext.deselectCommonsImage}
                cache={commonsImages.cache}
              />
            </div>
          )}

          {activeSubTab === "references" && (
            <ReferenceControls
              references={references}
              collapsed={collapsedBoxes.references}
              onToggle={() => onToggleBox("references")}
            />
          )}

          {activeSubTab === "subranks" && subtaxa.sources.length > 1 && (
            <SubtaxaControls subtaxa={subtaxa} collapsed={collapsedBoxes.subranks} onToggle={() => onToggleBox("subranks")} />
          )}

          {activeSubTab !== "image" && <WikitextEditorBox activeSubTab={activeSubTab} wikitext={wikitext} />}
        </>
      )}
    </div>
  );
}
