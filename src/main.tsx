import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Warm the Arabic typefaces (Cairo / Tajawal) once the Google Fonts
// stylesheet has registered its @font-face rules. These families are only
// used after the visitor switches to Arabic, so without this the very first
// EN -> AR toggle stalls while the browser downloads the fonts mid-interaction.
const ARABIC_FONT_SAMPLE = 'الأبجدية'
const ARABIC_FONTS: ReadonlyArray<[family: string, weights: ReadonlyArray<number>]> = [
  ['Cairo', [400, 500, 600, 700, 800, 900]],
  ['Tajawal', [400, 500, 700, 800, 900]],
]

const warmArabicFonts = () => {
  for (const [family, weights] of ARABIC_FONTS) {
    for (const weight of weights) {
      try {
        document.fonts.load(`${weight} 16px "${family}"`, ARABIC_FONT_SAMPLE)
      } catch {
        // Some weight/style variants are not defined by the remote stylesheet.
      }
    }
  }
}

if (typeof document !== 'undefined' && 'fonts' in document) {
  void document.fonts.ready.then(warmArabicFonts)
}
