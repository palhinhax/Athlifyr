import json
import os

# Translations to add to events.filters
new_translations = {
    "en": {
        "enabled": "Enabled",
        "disabled": "Disabled",
        "radius": "Radius: {distance} km",
        "clearAll": "Clear All",
        "apply": "Apply",
        "locationNotSupported": "Geolocation is not supported by your browser",
        "locationError": "Unable to retrieve your location"
    },
    "pt": {
        "enabled": "Ativado",
        "disabled": "Desativado",
        "radius": "Raio: {distance} km",
        "clearAll": "Limpar Tudo",
        "apply": "Aplicar",
        "locationNotSupported": "A geolocalização não é suportada pelo teu navegador",
        "locationError": "Não foi possível obter a tua localização"
    },
    "es": {
        "enabled": "Activado",
        "disabled": "Desactivado",
        "radius": "Radio: {distance} km",
        "clearAll": "Limpiar Todo",
        "apply": "Aplicar",
        "locationNotSupported": "La geolocalización no es compatible con tu navegador",
        "locationError": "No se pudo obtener tu ubicación"
    },
    "fr": {
        "enabled": "Activé",
        "disabled": "Désactivé",
        "radius": "Rayon : {distance} km",
        "clearAll": "Tout Effacer",
        "apply": "Appliquer",
        "locationNotSupported": "La géolocalisation n'est pas prise en charge par votre navigateur",
        "locationError": "Impossible d'obtenir votre position"
    },
    "de": {
        "enabled": "Aktiviert",
        "disabled": "Deaktiviert",
        "radius": "Radius: {distance} km",
        "clearAll": "Alle Löschen",
        "apply": "Anwenden",
        "locationNotSupported": "Geolokalisierung wird von Ihrem Browser nicht unterstützt",
        "locationError": "Standort konnte nicht abgerufen werden"
    },
    "it": {
        "enabled": "Attivato",
        "disabled": "Disattivato",
        "radius": "Raggio: {distance} km",
        "clearAll": "Cancella Tutto",
        "apply": "Applica",
        "locationNotSupported": "La geolocalizzazione non è supportata dal tuo browser",
        "locationError": "Impossibile ottenere la tua posizione"
    }
}

languages = ["en", "pt", "es", "fr", "de", "it"]

for lang in languages:
    file_path = f"messages/{lang}.json"
    
    print(f"Processing {file_path}...")
    
    # Read the file
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Add new translations to events.filters
    if "events" in data and "filters" in data["events"]:
        for key, value in new_translations[lang].items():
            if key not in data["events"]["filters"]:
                data["events"]["filters"][key] = value
                print(f"  ✅ Added {key}")
            else:
                print(f"  ⏭️  {key} already exists")
    else:
        print(f"  ⚠️  events.filters not found")
        continue
    
    # Write back to file with proper formatting
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ {file_path} updated\n")

print("🎉 All translation files updated successfully!")
