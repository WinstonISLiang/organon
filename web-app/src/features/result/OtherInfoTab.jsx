import { useT } from "@/i18n/useT.js";

// IUCN status codes (see GenerateResponse.iucn_status,
// organon.api.schemas), the same codes as {{Taxobox UICN}} on frwiki;
// their labels are the other.iucn.* messages.
const IUCN_CODES = ["EX", "EW", "RE", "CR", "EN", "VU", "NT", "LC", "DD", "NE"];

export default function OtherInfoTab({ activeData }) {
  const t = useT();
  return (
    <div className="panel">
      {activeData ? (
        <>
          {activeData.habitat && (
            <div className="field-box">
              <span className="field-label">{t("other.ecozone")}</span>
              <p>{activeData.habitat === "marin" ? t("other.habitat_marine") : t("other.habitat_terrestrial")}</p>
            </div>
          )}
          {activeData.iucn_status && (
            <div className="field-box">
              <span className="field-label">{t("other.iucn_status")}</span>
              <p>
                <strong>{activeData.iucn_status}</strong>
                {IUCN_CODES.includes(activeData.iucn_status) ? ` — ${t(`other.iucn.${activeData.iucn_status}`)}` : ""}
                {" "}{t("other.iucn_source")}
              </p>
            </div>
          )}
          <div className="field-box">
            <span className="field-label">{t("other.distribution")}</span>
            {activeData.distribution && Object.keys(activeData.distribution).length > 0 ? (
              <ul>
                {Object.entries(activeData.distribution).map(([moduleId, countries]) => (
                  <li key={moduleId}>
                    <strong>{moduleId.toUpperCase()}</strong> : {countries.join(", ")}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="panel-empty">{t("other.distribution_none")}</p>
            )}
          </div>
        </>
      ) : (
        <p className="panel-empty">{t("other.empty")}</p>
      )}
    </div>
  );
}
