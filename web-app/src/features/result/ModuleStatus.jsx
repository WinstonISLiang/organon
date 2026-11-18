import { useT } from "@/i18n/useT.js";

// Statuses of a module (classification or enrichment) during a streamed
// generation (see organon/api/routes/generate.py, ModuleStatusEvent).
// "pending" is purely frontend (added on the "plan" event, before the
// module really starts): the backend never emits it. Each status has a
// distinct shape AND label, not only a color (color-blind
// accessibility).
const KNOWN_STATUSES = ["pending", "running", "found", "empty", "error"];

function useStatusLabel(status) {
  const t = useT();
  return KNOWN_STATUSES.includes(status) ? t(`module_status.${status}`) : status;
}

export function ModuleStatusIcon({ status }) {
  const label = useStatusLabel(status);
  return (
    <span className={`module-status-icon module-status-${status}`} role="img" aria-label={label} title={label}>
      {status === "pending" && "○"}
      {status === "running" && <span className="module-status-spinner" aria-hidden="true" />}
      {status === "found" && "✓"}
      {status === "empty" && "✗"}
      {status === "error" && "⚠"}
      {status === "check" && "!"}
    </span>
  );
}

export function ModuleStatusDot({ status }) {
  const label = useStatusLabel(status);
  return <span className={`status-dot status-dot-${status}`} role="img" aria-label={label} title={label} />;
}
