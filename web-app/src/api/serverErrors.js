// Map known French API `detail` / module status strings to i18n keys.
// Backend messages stay French; the UI translates the ones users see.

const PATTERNS = [
  {
    re: /^Taxon « (.+) » non trouvé \(classifications essayées : (.+)\)\.$/,
    key: "errors.taxon_not_found",
    params: (m) => ({ taxon: m[1], tried: m[2] }),
  },
  {
    re: /^Modules de classification en erreur réseau : (.+)\.$/,
    key: "errors.classification_network",
    params: (m) => ({ modules: m[1] }),
  },
  {
    re: /^Module de classification '(.+)' inconnu ou désactivé\.$/,
    key: "errors.classification_unknown",
    params: (m) => ({ id: m[1] }),
  },
  {
    re: /^Aucun module de classification disponible\.$/,
    key: "errors.classification_none",
  },
  {
    re: /^taxon non trouvé$/,
    key: "errors.taxon_not_found_short",
  },
  {
    re: /^Authentification requise \(voir \/api\/v1\/auth\/login\)\.$/,
    key: "errors.auth_required",
  },
  {
    re: /^Plusieurs items Wikidata portent ce nom\.$/,
    key: "errors.wikidata_ambiguous",
  },
  {
    re: /^Item Wikidata introuvable\.$/,
    key: "errors.wikidata_item_not_found",
  },
  {
    re: /^Propositions inconnues du diagnostic : (.+)$/,
    key: "errors.unknown_proposals",
    params: (m) => ({ ids: m[1] }),
  },
  {
    re: /^Aucun item Wikidata sur lequel ajouter ces valeurs\.$/,
    key: "errors.no_wikidata_item_for_export",
  },
  {
    re: /^Requête réseau échouée : (.+) \((.+)\)$/,
    key: "errors.network_request_failed",
    params: (m) => ({ type: m[1], where: m[2] }),
  },
  {
    re: /^État OAuth invalide ou expiré, merci de relancer la connexion\.$/,
    key: "errors.oauth_state_invalid",
  },
  {
    re: /^Échec de l'échange OAuth avec Wikimedia : (.+)$/,
    key: "errors.oauth_exchange_failed",
    params: (m) => ({ detail: m[1] }),
  },
  {
    re: /^Réponse de profil OAuth invalide \(nom d'utilisateur manquant\)\.$/,
    key: "errors.oauth_profile_invalid",
  },
  {
    re: /^OAuth non configuré côté serveur \(ORGANON_OAUTH_CLIENT_ID \/ ORGANON_OAUTH_CLIENT_SECRET \/ ORGANON_OAUTH_REDIRECT_URI manquants\) — nécessite l'enregistrement préalable d'un consumer OAuth 2\.0\.$/,
    key: "errors.oauth_not_configured",
  },
  {
    re: /^Identifiants du compte bot non configurés côté serveur\.$/,
    key: "errors.bot_credentials_missing",
  },
  {
    re: /^Édition par le bot désactivée : en attente de la clarification communautaire du statut du bot \(voir Discussion Projet:Biologie\/Organon\) et de la protection en écriture de la page de permission\.$/,
    key: "errors.bot_edit_disabled",
  },
  {
    re: /^Utilisateur « (.+) » non autorisé \(voir (.+)\)\.$/,
    key: "errors.bot_user_unauthorized",
    params: (m) => ({ username: m[1], page: m[2] }),
  },
];

/** Translate a known French server message, or return null if unknown. */
export function translateServerMessage(message, t) {
  if (!message || typeof message !== "string") return null;
  for (const { re, key, params } of PATTERNS) {
    const match = message.match(re);
    if (match) return t(key, params?.(match));
  }
  return null;
}
