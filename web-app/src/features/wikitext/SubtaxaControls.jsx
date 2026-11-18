import { useT } from "@/i18n/useT.js";
import ControlBox from "./ControlBox.jsx";
import { isSpeciesChecked, rankTextFor } from "./subtaxaMerge.js";

export default function SubtaxaControls({ subtaxa, collapsed, onToggle }) {
  const t = useT();
  const { merge } = subtaxa;
  return (
    <ControlBox title={t("subtaxa.title")} collapsed={collapsed} onToggle={onToggle}>
      {subtaxa.enabled && (
        <div className="data-table-wrap subtaxa-merge-groups">
          {!merge && <p>{t("subtaxa.computing")}</p>}
          {merge?.groups.length === 0 && <p>{t("subtaxa.none")}</p>}
          {merge?.groups.map((group, gi) => {
            const groupCheckedCount = group.species.filter((sp) => isSpeciesChecked(subtaxa.checked, gi, sp)).length;
            const groupAllChecked = groupCheckedCount === group.species.length;
            const { plural, singular } = rankTextFor(group.species, merge.rank_names);
            return (
              <div key={gi} className="subtaxa-merge-group">
                <p className="subtaxa-merge-group-head">
                  {group.sources.map((s) => (
                    <span key={s} className="id-badge">
                      {s.toUpperCase()}
                    </span>
                  ))}
                  <span className="subtaxa-merge-group-count">
                    {group.species.length} {group.species.length === 1 ? singular : plural}
                  </span>
                  <button
                    type="button"
                    className="subtaxa-merge-group-toggle"
                    onClick={() => subtaxa.setGroupChecked(gi, group, !groupAllChecked)}
                  >
                    {groupAllChecked ? t("subtaxa.exclude_all") : t("subtaxa.include_all")}
                  </button>
                </p>
                <ul className="subtaxa-merge-species-list">
                  {group.species.map((sp) => (
                    <li key={sp.name}>
                      <label className="facet-checkbox">
                        <input
                          type="checkbox"
                          checked={isSpeciesChecked(subtaxa.checked, gi, sp)}
                          onChange={() => subtaxa.toggleSpecies(gi, sp.name)}
                        />
                        {sp.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </ControlBox>
  );
}
