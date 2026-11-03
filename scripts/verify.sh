#!/usr/bin/env bash
# Prueft alle Bestandteile des Projekts, die sich ohne Cloud-Foundry-Zugang
# pruefen lassen. Aufruf aus dem Projektwurzelverzeichnis: bash scripts/verify.sh
set -u
cd "$(dirname "$0")/.."
fehler=0
ok()   { echo "  OK      $1"; }
fail() { echo "  FEHLER  $1"; fehler=$((fehler + 1)); }

echo "### CDS-Modell"
for f in srv/witz-service.cds srv/uebersicht-service.cds; do
  npx --no-install cds compile "$f" --to sql >/dev/null 2>&1 && ok "$f" || fail "$f"
done
npx --no-install cds compile srv/witz-service.cds app/witze/annotations.cds --to edmx >/dev/null 2>&1 \
  && ok "app/witze/annotations.cds" || fail "app/witze/annotations.cds"

echo "### Produktionsbuild"
rm -rf gen
npx --no-install cds build --production >/dev/null 2>&1 && ok "cds build --production" || fail "cds build --production"

echo "### Tests (Node: CAP-Service, Application Router, Zentrale Komponenten)"
# app/router hat eigene Abhaengigkeiten (jwt-decode, @sap/approuter) fuer
# test/getuserinfo-handler.test.js, das "cds test" ueber den gesamten
# Projektbaum mit findet.
[ -d app/router/node_modules ] || ( cd app/router && npm install >/dev/null 2>&1 )
npx --no-install cds test >/dev/null 2>&1 && ok "cds test" || fail "cds test"

echo "### CAP-Java-Modul (CDS-Teil)"
( cd java && ../node_modules/.bin/cds build --for java >/dev/null 2>&1 ) \
  && ok "cds build --for java" || fail "cds build --for java"

echo "### CAP-Java-Modul (Tests)"
if (cd java && mvn -q -B -o dependency:resolve >/dev/null 2>&1) || (cd java && mvn -q -B dependency:resolve >/dev/null 2>&1); then
  ( cd java && mvn -B clean verify >/dev/null 2>&1 ) && ok "mvn verify" || fail "mvn verify"
else
  echo "  UEBERSPRUNGEN  java (Abhaengigkeiten nicht aufloesbar - z. B. kein Zugriff auf Maven Central)"
fi

echo "### MTA-Deskriptor"
mbt validate -m schema   >/dev/null 2>&1 && ok "mta.yaml (schema)"   || fail "mta.yaml (schema)"
mbt validate             >/dev/null 2>&1 && ok "mta.yaml (semantic)" || fail "mta.yaml (semantic)"
mbt validate -e prod.mtaext >/dev/null 2>&1 && ok "prod.mtaext"      || fail "prod.mtaext"

echo "### JSON-Artefakte"
for f in xs-security.json app/router/xs-app.json app/witze/xs-app.json \
         app/witze/webapp/manifest.json db/optional/moderation.hdbgrants \
         db/optional/MODERATION_SPERRLISTE.hdbsynonym db/src/.hdiconfig \
         cloud-sdk/systems.json cloud-sdk/destinations.json \
         zentrale-komponenten/versions.json zentrale-komponenten/ui5-proxy/package.json; do
  python3 -c "import json;json.load(open('$f'))" >/dev/null 2>&1 && ok "$f" || fail "$f"
done

echo "### Cloud SDK (TypeScript)"
if [ -d cloud-sdk/node_modules ]; then
  ( cd cloud-sdk && ./node_modules/.bin/tsc --noEmit >/dev/null 2>&1 ) && ok "tsc --noEmit" || fail "tsc --noEmit"
  ( cd cloud-sdk && npx --no-install jest >/dev/null 2>&1 ) && ok "jest" || fail "jest"
else
  echo "  UEBERSPRUNGEN  cloud-sdk (npm ci noch nicht ausgefuehrt)"
fi

echo "### Python-Modul"
python3 -m py_compile statistik/server.py >/dev/null 2>&1 && ok "statistik/server.py (compile)" || fail "statistik/server.py (compile)"
if [ -d statistik/.venv ]; then
  ( cd statistik && . .venv/bin/activate && pytest -q >/dev/null 2>&1 ) && ok "statistik (pytest)" || fail "statistik (pytest)"
else
  echo "  UEBERSPRUNGEN  statistik (pytest) - einmalig einrichten mit:"
  echo "                 python3 -m venv statistik/.venv && . statistik/.venv/bin/activate && pip install -r statistik/requirements-test.txt"
fi

echo "### Zentrale Komponenten"
node zentrale-komponenten/check-versions.js >/dev/null 2>&1 && ok "check-versions.js" || fail "check-versions.js"
( cd zentrale-komponenten/ui5-proxy && node --test >/dev/null 2>&1 ) && ok "ui5-proxy (node --test)" || fail "ui5-proxy (node --test)"

echo
if [ "$fehler" -eq 0 ]; then echo "Alle Pruefungen erfolgreich."; else echo "$fehler Pruefung(en) fehlgeschlagen."; fi
exit "$fehler"
