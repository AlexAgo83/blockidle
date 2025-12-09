import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    // Place le build dans /build à la racine pour coller au publish dir Render
    outDir: '../build',
    emptyOutDir: true
  }
})
