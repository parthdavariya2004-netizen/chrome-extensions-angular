import * as esbuild from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import babel from '@babel/core';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Step 1: Compile content.ts and background.ts with Angular's compiler (ngc)
console.log('🔨 Compiling scripts with Angular compiler...');
execSync('npx ngc -p tsconfig.scripts.json', { cwd: projectRoot, stdio: 'inherit' });

// Load the Angular linker once
const linkerModule = await import('@angular/compiler-cli/linker/babel');
const linkerPlugin = linkerModule.default;

// Custom esbuild plugin to use Angular linker
const angularLinkerPlugin = {
  name: 'angular-linker',
  setup(build) {
    build.onLoad({ filter: /\.m?js$/ }, async (args) => {
      const code = await fs.promises.readFile(args.path, 'utf8');

      // Only process files that contain Angular partial declarations
      if (!code.includes('ɵɵngDeclare')) {
        return { contents: code, loader: 'js' };
      }

      const fileName = args.path.split(/[\\/]/).slice(-2).join('/');
      console.log(`  Linking: ${fileName}`);

      try {
        const result = await babel.transformAsync(code, {
          filename: args.path,
          plugins: [linkerPlugin],
          compact: false,
          sourceMaps: false,
        });

        return { contents: result.code, loader: 'js' };
      } catch (e) {
        console.error(`  Linker error for ${fileName}:`, e.message);
        return { contents: code, loader: 'js' };
      }
    });
  },
};

// Step 2: Bundle the compiled JS files with linker
console.log('📦 Bundling content script...');
await esbuild.build({
  entryPoints: [resolve(projectRoot, 'dist/scripts/content.js')],
  bundle: true,
  outfile: resolve(projectRoot, 'dist/jiraangular/browser/content.js'),
  format: 'iife',
  target: 'es2020',
  platform: 'browser',
  sourcemap: false,
  minify: false,
  plugins: [angularLinkerPlugin],
  define: {
    ngDevMode: 'false',
  },
});

console.log('📦 Bundling background script...');
await esbuild.build({
  entryPoints: [resolve(projectRoot, 'dist/scripts/background.js')],
  bundle: true,
  outfile: resolve(projectRoot, 'dist/jiraangular/browser/background.js'),
  format: 'iife',
  target: 'es2020',
  platform: 'browser',
  sourcemap: false,
  minify: false,
});

console.log('✅ Content and background scripts built successfully!');
