import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Inline the bundled CSS asset directly into <head> at build time. This removes
// the render-blocking stylesheet request entirely: first paint no longer waits
// on a second HTTP round-trip for CSS. The file is still split/hashed by Vite,
// just embedded into the HTML shell (a single-page portfolio — acceptable).
function inlineCss(): Plugin {
  return {
    name: 'inline-build-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const entries = Object.values(bundle);
      const cssAssets = entries.filter(
        (chunk) => chunk.type === 'asset' && /assets\/.*\.css$/.test(chunk.fileName),
      );
      if (cssAssets.length === 0) return;
      const htmlChunk = entries.find(
        (chunk) => chunk.type === 'asset' && chunk.fileName === 'index.html',
      );
      if (!htmlChunk || htmlChunk.type !== 'asset') return;

      for (const cssChunk of [...cssAssets].sort((a, b) => a.fileName.localeCompare(b.fileName))) {
        if (cssChunk.type !== 'asset') continue;
        const css = typeof cssChunk.source === 'string' ? cssChunk.source : String(cssChunk.source);
        const escaped = cssChunk.fileName.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
        const link = new RegExp(`\\s*<link rel="stylesheet"[^>]*href="[^"]*${escaped}"[^>]*>`);
        let html = typeof htmlChunk.source === 'string' ? htmlChunk.source : String(htmlChunk.source);
        if (!link.test(html)) {
          this.warn(`[inline-css] no <link> found for ${cssChunk.fileName}, skipping inline`);
          continue;
        }
        html = html.replace(link, `\n    <style>${css}</style>`);
        htmlChunk.source = html;
        delete bundle[cssChunk.fileName];
        this.info(`[inline-css] inlined ${cssChunk.fileName} (${(css.length / 1024).toFixed(1)} KB) into index.html`);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    inlineCss(),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            },
            {
              name: 'vendor-motion',
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils|tslib)[\\/]/,
            },
            {
              name: 'vendor-icons',
              test: /node_modules[\\/](lucide-react)[\\/]/,
            },
          ],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});