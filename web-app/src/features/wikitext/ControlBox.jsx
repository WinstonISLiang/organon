import { useT } from "@/i18n/useT.js";

// Collapsible "controls" area (Taxobox rank choice, reference
// checklist, sub-rank merge): collapsed once the choice is made, to
// keep only the header.
export default function ControlBox({ title, collapsed, onToggle, children }) {
  const t = useT();
  return (
    <div className="render-box">
      <div className="render-box-header">
        <h4 className="render-box-title">{title}</h4>
        <span className="render-box-actions">
          <button type="button" className="footer-link" onClick={onToggle}>
            {collapsed ? t("common.expand") : t("common.collapse")}
          </button>
        </span>
      </div>
      {!collapsed && children}
    </div>
  );
}
