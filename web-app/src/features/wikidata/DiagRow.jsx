import { useT } from "@/i18n/useT.js";

// Rows of the Review and Complete tabs.

// Value present on both sides but different: each value names its
// source, none is ever corrected from the other.
export function ReviseRow({ label, message, leftLabel, left, rightLabel, right, href }) {
  const t = useT();
  return (
    <li className="rev-row">
      <span className="rev-mark" role="img" aria-label={t("wikidata.different")}>≠</span>
      <div className="rev-label">
        <span className="rev-name">{label}</span>
        {message && <span className="rev-msg">{message}</span>}
      </div>
      <div className="rev-val">
        <span className="rev-src">{leftLabel}</span>
        {left ?? t("wikidata.absent")}
      </div>
      <div className="rev-val">
        <span className="rev-src">{rightLabel}</span>
        {right ?? "—"}
      </div>
      {href && (
        <a className="rev-open" href={href} target="_blank" rel="noopener noreferrer">
          {t("wikidata.open")}<span className="sr-only">{t("wikidata.open_sr", { label })}</span>
        </a>
      )}
    </li>
  );
}

// Proposed addition. With `onToggle` the row is checkable (an
// exportable Wikidata proposal); without, it is a gap to fill by hand.
export function CompleteRow({ label, detail, reference, badge, checked, onToggle }) {
  const t = useT();
  const body = (
    <>
      <span className="cmp-plus" aria-hidden="true">+</span>
      <span className="cmp-body">
        <span className="cmp-name">{label}</span>
        <span className="cmp-detail">{detail}</span>
        {reference && <span className="cmp-ref">{reference}</span>}
      </span>
      {badge && <span className="chip chip-neutre cmp-badge">{badge}</span>}
    </>
  );
  if (!onToggle) return <li className="cmp-row">{body}</li>;
  return (
    <li>
      <label className="cmp-row cmp-row-check">
        <input type="checkbox" checked={checked} onChange={onToggle} aria-label={t("wikidata.select", { label })} />
        {body}
      </label>
    </li>
  );
}
