#!/bin/bash

# Définit le dossier source de l'extension
EXTENSION_DIR="firefox_extension"

# Vérifie que le dossier existe
if [ ! -d "$EXTENSION_DIR" ]; then
        echo "❌ Erreur : le dossier '$EXTENSION_DIR' n'existe pas"
        exit 1
fi

# Récupère la version depuis le manifest
VERSION=$(grep '"version"' "$EXTENSION_DIR/manifest.json" | cut -d'"' -f4)

if [ -z "$VERSION" ]; then
        echo "❌ Erreur : impossible de lire la version dans manifest.json"
        exit 1
fi

OUTPUT_DIR="$EXTENSION_DIR/dist"
ZIP_NAME="lm-assistant-v${VERSION}.zip"

mkdir -p "$OUTPUT_DIR"

# Crée le ZIP proprement (en se plaçant dans le dossier de l'extension)
cd "$EXTENSION_DIR"
zip -r "dist/$ZIP_NAME" \
        manifest.json \
        background.js \
        content.js \
        icons/ \
        popup/ \
        -x "*.DS_Store" -x "*__pycache__*" -x "dist/*"

cd ..

echo "✅ Extension zippée : $EXTENSION_DIR/dist/$ZIP_NAME"