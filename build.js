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

console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });

console.log('Moving frontend build to correct location...');
if (fs.existsSync('dist/public')) {
  if (fs.existsSync('dist/client')) {
    fs.rmSync('dist/client', { recursive: true });
  }
  fs.renameSync('dist/public', 'dist/client');
}

console.log('✅ Build complete!');
