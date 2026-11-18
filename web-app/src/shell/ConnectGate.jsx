import { LOGIN_URL } from "@/api/client.js";
import { useT } from "@/i18n/useT.js";

export default function ConnectGate() {
  const t = useT();
  return (
    <div className="console connect-gate">
      <p className="connect-gate-desc">{t("connect.description")}</p>
      <p className="connect-gate-desc">{t("connect.restricted")}</p>
      <a className="run connect-gate-cta" href={LOGIN_URL}>
        {t("connect.cta")}
      </a>
    </div>
  );
}
