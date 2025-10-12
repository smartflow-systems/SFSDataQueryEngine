#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building server...');
execSync('tsc -p tsconfig.json', { stdio: 'inherit' });

console.log('Creating production entry point...');
const distIndex = `// Entry point for production
import('./server/index.js').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
`;
fs.writeFileSync('dist/index.js', distIndex);

console.log('Fixing vite.js imports...');
const viteJsPath = 'dist/server/vite.js';
let viteJs = fs.readFileSync(viteJsPath, 'utf-8');
viteJs = viteJs.replace('from "../vite.config"', 'from "../vite.config.js"');
fs.writeFileSync(viteJsPath, viteJs);

console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });

console.log('✅ Build complete!');
