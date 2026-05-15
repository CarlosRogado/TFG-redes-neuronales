import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [rehypeKatex],
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100,
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mdx', '.md']
  }
})

