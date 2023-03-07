import { resolve } from 'path';
import { glob } from 'glob';
import { defineConfig } from 'vite'
const input = {};
const htmlFiles = await glob('**/*.html', {ignore: ['node_modules/**', 'dist/**']});
htmlFiles.forEach((htmlFile, index) => {input[index] = resolve(__dirname, htmlFile);});

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: input,
    },
  },
})
