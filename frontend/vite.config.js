// frontend/vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    base: '',

    build: {
        emptyOutDir: true,

        rollupOptions: {
            input: resolve(__dirname, 'src/main.js'),

            output: {
                // Désactive la génération de HTML
                entryFileNames: 'js/[name].js',
                chunkFileNames: 'js/[name].js',
                assetFileNames: (assetInfo) => {
                    // CSS dans css/, autres assets dans assets/
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'css/[name].[ext]'
                    }
                    return 'assets/[name].[ext]'
                }
            }
        },

        // Dossier de sortie vers ton backend Django
        outDir: '../backend/apps/core/static'
    }
})