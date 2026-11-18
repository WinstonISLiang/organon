import { useT } from "@/i18n/useT.js";
import ControlBox from "./ControlBox.jsx";
import { referenceItemKey } from "./useReferenceChecklist.js";

export default function ReferenceControls({ references, collapsed, onToggle }) {
  const t = useT();
  return (
    <ControlBox title={t("references.title")} collapsed={collapsed} onToggle={onToggle}>
      <div className="reference-checklist">
        <div className="reference-checklist-row reference-checklist-row-locked">
          <span className="reference-checklist-lock" aria-hidden="true">🔒</span>
          <span className="id-badge">{t("references.other_projects")}</span>
          <span className="reference-checklist-note">
            {t("references.always_included")}
          </span>
        </div>
        {references.items.map((item) => {
          const key = referenceItemKey(item);
          const checked = references.checkedOverrides[key] ?? item.default_checked;
          return (
            <label key={key} className="reference-checklist-row">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => references.toggleItem(key, checked)}
                aria-label={t("references.include", { module: item.module_id })}
              />
              <span className="id-badge">{item.module_id.toUpperCase()}</span>
              {!item.default_checked && <span className="id-badge id-badge-conflict">{t("references.out_of_domain")}</span>}
              <code>{item.wikitext}</code>
            </label>
          );
        })}
      </div>
    </ControlBox>
  );
}
