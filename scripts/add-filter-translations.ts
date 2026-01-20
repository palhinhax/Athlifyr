import fs from "fs";
import path from "path";

// Translations to add to events.filters
const newTranslations: Record<string, Record<string, string>> = {
  en: {
    enabled: "Enabled",
    disabled: "Disabled",
    radius: "Radius: {distance} km",
    clearAll: "Clear All",
    apply: "Apply",
    locationNotSupported: "Geolocation is not supported by your browser",
    locationError: "Unable to retrieve your location",
  },
  pt: {
    enabled: "Ativado",
    disabled: "Desativado",
    radius: "Raio: {distance} km",
    clearAll: "Limpar Tudo",
    apply: "Aplicar",
    locationNotSupported: "A geolocalização não é suportada pelo teu navegador",
    locationError: "Não foi possível obter a tua localização",
  },
  es: {
    enabled: "Activado",
    disabled: "Desactivado",
    radius: "Radio: {distance} km",
    clearAll: "Limpiar Todo",
    apply: "Aplicar",
    locationNotSupported:
      "La geolocalización no es compatible con tu navegador",
    locationError: "No se pudo obtener tu ubicación",
  },
  fr: {
    enabled: "Activé",
    disabled: "Désactivé",
    radius: "Rayon : {distance} km",
    clearAll: "Tout Effacer",
    apply: "Appliquer",
    locationNotSupported:
      "La géolocalisation n'est pas prise en charge par votre navigateur",
    locationError: "Impossible d'obtenir votre position",
  },
  de: {
    enabled: "Aktiviert",
    disabled: "Deaktiviert",
    radius: "Radius: {distance} km",
    clearAll: "Alle Löschen",
    apply: "Anwenden",
    locationNotSupported:
      "Geolokalisierung wird von Ihrem Browser nicht unterstützt",
    locationError: "Standort konnte nicht abgerufen werden",
  },
  it: {
    enabled: "Attivato",
    disabled: "Disattivato",
    radius: "Raggio: {distance} km",
    clearAll: "Cancella Tutto",
    apply: "Applica",
    locationNotSupported:
      "La geolocalizzazione non è supportata dal tuo browser",
    locationError: "Impossibile ottenere la tua posizione",
  },
};

const languages = ["en", "pt", "es", "fr", "de", "it"];

for (const lang of languages) {
  const filePath = path.join("messages", `${lang}.json`);

  console.log(`Processing ${filePath}...`);

  // Read the file
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Add new translations to events.filters
  if (data.events && data.events.filters) {
    let added = 0;
    for (const [key, value] of Object.entries(newTranslations[lang])) {
      if (!(key in data.events.filters)) {
        data.events.filters[key] = value;
        console.log(`  ✅ Added ${key}`);
        added++;
      } else {
        console.log(`  ⏭️  ${key} already exists`);
      }
    }
    console.log(`  📊 Added ${added} new translations`);
  } else {
    console.log(`  ⚠️  events.filters not found`);
    continue;
  }

  // Write back to file with proper formatting
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");

  console.log(`✅ ${filePath} updated\n`);
}

console.log("🎉 All translation files updated successfully!");
