#!/bin/bash

EXTENSION_DIR="firefox_extension"

if [ ! -d "$EXTENSION_DIR" ]; then
        echo "❌ Erreur : le dossier '$EXTENSION_DIR' n'existe pas"
        exit 1
fi

VERSION=$(grep '"version"' "$EXTENSION_DIR/manifest.json" | cut -d'"' -f4)

if [ -z "$VERSION" ]; then
        echo "❌ Erreur : impossible de lire la version dans manifest.json"
        exit 1
fi

OUTPUT_DIR="$EXTENSION_DIR/dist"
ZIP_NAME="lm-assistant-v${VERSION}.zip"

mkdir -p "$OUTPUT_DIR"

# La clé : se déplacer DANS le dossier avant de zipper
cd "$EXTENSION_DIR"

# Zipper le contenu courant (.) mais en excluant le dossier dist
zip -r "dist/$ZIP_NAME" . \
        -x "dist/*" \
        -x "*.DS_Store" \
        -x "*__pycache__*"

cd ..

echo "✅ Extension zippée : $EXTENSION_DIR/dist/$ZIP_NAME"
