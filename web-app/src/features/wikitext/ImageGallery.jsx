// "Image" sub-tab of the "Results" block (see App.jsx, wikitextSubTab
// === "image"): gallery of Wikimedia Commons suggestions for the
// taxobox, already filtered server-side by permissive license and
// quality or featured distinction (see
// organon/modules/commons_images/service.py). This component only
// displays, never refilters.
//
// Two distinct actions per thumbnail, deliberately non-conflicting:
// clicking the image selects the file for the taxobox (`onSelect`), the
// "Voir sur Commons" link next to it opens the file page in a new tab
// without selecting anything (stopPropagation and a dedicated target).
//
// The search itself is triggered in App.jsx as soon as the taxon is
// known, not here: this sub-tab is unmounted and remounted on each
// switch, so an effect here would miss searches launched before its
// first opening. `cache` (indexed by taxon) may thus already hold the
// entry on arrival.
import { apiErrorMessage } from "@/api/client.js";
import { useT } from "@/i18n/useT.js";

export default function ImageGallery({ taxon, selectedFileName, onSelect, onDeselect, cache }) {
  const t = useT();
  const entry = taxon ? cache[taxon] : null;

  if (!taxon) {
    return <div className="panel-empty">{t("images.start")}</div>;
  }
  if (!entry || entry.status === "loading") {
    return (
      <div className="panel-loading">
        <p>{t("images.searching")}</p>
      </div>
    );
  }
  if (entry.status === "error") {
    return <div className="panel-empty">{t("images.error", { error: apiErrorMessage(entry.error, t) || t("errors.unknown") })}</div>;
  }

  const { suggestions, category_url: categoryUrl, search_url: searchUrl } = entry.data;
  const browseUrl = categoryUrl || searchUrl;

  if (suggestions.length === 0) {
    return (
      <div className="panel-empty image-gallery-empty">
        <p>{t("images.empty")}</p>
        <a className="edit-btn" href={browseUrl} target="_blank" rel="noopener noreferrer">
          {categoryUrl ? t("images.browse_category") : t("images.browse_commons")}
        </a>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <p className="result-sub">{t("images.intro")}</p>
      <div className="image-gallery-grid">
        {suggestions.map((s) => {
          const selected = s.file_name === selectedFileName;
          return (
            <div className={"image-card" + (selected ? " selected" : "")} key={s.file_name}>
              {/*
                 The "Sélectionnée" badge becomes the deselect button:
                 same place, but not nested in the select button (a
                 button in a button is invalid HTML).
               */}
              <div className="image-card-thumb-wrap">
                <button
                  type="button"
                  className="image-card-thumb"
                  onClick={() => onSelect(s.file_name)}
                  aria-pressed={selected}
                  title={selected ? t("images.thumb_selected") : t("images.thumb_use")}
                >
                  <img src={s.thumb_url} alt={s.file_name} loading="lazy" />
                  {s.is_wikidata_image && (
                    <span className="image-card-badge image-card-badge-wikidata">{t("images.wikidata_badge")}</span>
                  )}
                </button>
                {selected && (
                  <button
                    type="button"
                    className="image-card-badge image-card-badge-selected image-card-deselect"
                    onClick={onDeselect}
                    title={t("images.deselect_title")}
                  >
                    {t("images.deselect")}
                  </button>
                )}
              </div>
              <div className="image-card-meta">
                <span className="image-card-license" title={s.file_name}>
                  {s.license_label}
                </span>
                <a href={s.page_url} target="_blank" rel="noopener noreferrer" className="image-card-link">
                  {t("images.view_on_commons")}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
