import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    // Place le build dans /dist à la racine (Render attend généralement ce dossier)
    outDir: '../dist',
    emptyOutDir: true
  }
})
