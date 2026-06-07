import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const portfolioDir = __dirname;
const gameDir = path.join(__dirname, '..', 'Game');

console.log('=== Step 1: Installing npm dependencies ===');
try {
  execSync('npm install zustand@3.7.0 @react-three/cannon @supabase/supabase-js@1.35.7 leva react-colorful use-asset lodash-es inter-ui', { stdio: 'inherit' });
  execSync('npm install -D three-stdlib @types/lodash-es', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install dependencies:', error);
}

console.log('\n=== Step 2: Creating public/game asset directories ===');
const publicGameDir = path.join(portfolioDir, 'public', 'game');
const dirsToCreate = ['models', 'sounds', 'textures', 'images'];

dirsToCreate.forEach(dir => {
  const dirPath = path.join(publicGameDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

console.log('=== Step 3: Copying assets ===');
const copyAssets = (sourceType) => {
  const sourcePath = path.join(gameDir, 'public', sourceType);
  const destPath = path.join(publicGameDir, sourceType);
  
  if (fs.existsSync(sourcePath)) {
    fs.cpSync(sourcePath, destPath, { recursive: true });
    console.log(`Copied ${sourceType} successfully.`);
  } else {
    console.log(`Source directory ${sourcePath} does not exist. Skipping.`);
  }
};

['models', 'sounds', 'textures', 'images'].forEach(copyAssets);

console.log('\n=== Done! ===');
console.log('Now you can restart your dev server with: npm run dev');
