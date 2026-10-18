import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Blog drafts (front matter `draft: true`) are filtered out at runtime, but the
// eager glob in src/app/data/blog.ts would still bundle their text. In
// production builds, swap each draft's source for a bare draft stub so the
// unpublished writing never ships.
function stripBlogDrafts(): Plugin {
  return {
    name: 'strip-blog-drafts',
    apply: 'build',
    transform(code, id) {
      if (!/[\\/]data[\\/]blog[\\/][^\\/]+\.md\?raw$/.test(id)) return
      // ?raw modules arrive as `export default "<JSON string>"`
      const raw: string = JSON.parse(code.replace(/^export default /, '').replace(/;\s*$/, ''))
      const front = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
      if (!/^draft:\s*["']?true["']?\s*$/m.test(front)) return
      return { code: 'export default "---\\ndraft: true\\n---\\n"', map: null }
    },
  }
}

export default defineConfig({
  plugins: [
    stripBlogDrafts(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.pdf'],
})
