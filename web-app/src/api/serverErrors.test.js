import assert from "node:assert/strict";
import test from "node:test";

import { flatten, interpolate } from "../i18n/core.js";
import en from "../i18n/locales/en.json" with { type: "json" };
import { translateServerMessage } from "./serverErrors.js";

const messages = flatten(en);
const t = (key, vars) => {
  const template = messages[key];
  assert.ok(template, `missing key ${key}`);
  return interpolate(template, vars);
};

test("translates the generation not-found fatal error", () => {
  assert.equal(
    translateServerMessage(
      "Taxon « cellana pricei » non trouvé (classifications essayées : gbif, wrms).",
      t,
    ),
    "Taxon “cellana pricei” not found (classifications tried: gbif, wrms).",
  );
});

test("translates short module status and auth/OAuth details", () => {
  assert.equal(translateServerMessage("taxon non trouvé", t), "taxon not found");
  assert.equal(
    translateServerMessage("Authentification requise (voir /api/v1/auth/login).", t),
    "Authentication required (see /api/v1/auth/login).",
  );
  assert.equal(
    translateServerMessage("Plusieurs items Wikidata portent ce nom.", t),
    "Several Wikidata items share this name.",
  );
  assert.equal(
    translateServerMessage("Requête réseau échouée : ConnectTimeout (www.wikidata.org)", t),
    "Network request failed: ConnectTimeout (www.wikidata.org)",
  );
});

test("leaves unknown server messages untouched", () => {
  assert.equal(translateServerMessage("Quelque chose d'imprévu", t), null);
  assert.equal(translateServerMessage("", t), null);
});
