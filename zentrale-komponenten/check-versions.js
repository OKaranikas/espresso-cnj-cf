#!/usr/bin/env node
// Prueft, ob die package.json-Dateien der einzelnen Node-Projekte und die
// ui5.yaml der Fiori-Anwendung mit der zentralen Versionsvorgabe in
// versions.json uebereinstimmen. Aufruf aus dem Projektwurzelverzeichnis:
//
//   node zentrale-komponenten/check-versions.js
//
// Wird zusaetzlich von scripts/verify.sh und vom npm-Script
// "check-versions" der einzelnen Projekte aufgerufen.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const hier = dirname(fileURLToPath(import.meta.url))
const wurzel = join(hier, '..')
const zentral = JSON.parse(readFileSync(join(hier, 'versions.json'), 'utf8'))

const pfadKurz = pfad => relative(wurzel, pfad)

function ladeJson(pfad) {
  return JSON.parse(readFileSync(pfad, 'utf8'))
}

let fehler = 0

// --- Node-Abhaengigkeiten -------------------------------------------------

const packageJsons = [
  join(wurzel, 'package.json'),                 // cnj-srv (CAP Node.js)
  join(wurzel, 'cloud-sdk/package.json'),
  join(wurzel, 'app/router/package.json'),
  join(wurzel, 'app/witze/package.json')
]

for (const pfad of packageJsons) {
  const pkg = ladeJson(pfad)
  const vorhanden = { ...pkg.dependencies, ...pkg.devDependencies }

  for (const [name, erwartet] of Object.entries(zentral.node)) {
    const tatsaechlich = vorhanden[name]
    if (tatsaechlich === undefined) continue // Bibliothek wird hier nicht verwendet
    if (tatsaechlich !== erwartet) {
      console.error(
        `FEHLER  ${pfadKurz(pfad)}: ${name} = "${tatsaechlich}", ` +
        `zentral vorgegeben ist "${erwartet}" (zentrale-komponenten/versions.json)`
      )
      fehler++
    }
  }
}

// --- UI5-Framework-Version (app/witze/ui5.yaml) ---------------------------

const ui5YamlPfad = join(wurzel, 'app/witze/ui5.yaml')
const ui5Yaml = readFileSync(ui5YamlPfad, 'utf8')
const erwarteteVersion = `version: "${zentral.ui5.version}"`

if (!ui5Yaml.includes(erwarteteVersion)) {
  console.error(
    `FEHLER  ${pfadKurz(ui5YamlPfad)}: framework.version weicht von der ` +
    `zentralen UI5-Version "${zentral.ui5.version}" ab (zentrale-komponenten/versions.json)`
  )
  fehler++
}

// --- Ergebnis ---------------------------------------------------------------

if (fehler === 0) {
  console.log(
    `OK  ${packageJsons.length} package.json-Dateien und ui5.yaml stimmen mit ` +
    `zentrale-komponenten/versions.json ueberein.`
  )
  process.exit(0)
} else {
  console.error(`\n${fehler} Abweichung(en) von der zentralen Versionsvorgabe.`)
  process.exit(1)
}
