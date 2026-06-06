import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const publicAwardsDir = path.join(__dirname, 'public', 'assets', 'awards');

const foldersToCopy = ['Techfiesta', 'Pune Agri', 'vois'];

if (!fs.existsSync(publicAwardsDir)) {
  fs.mkdirSync(publicAwardsDir, { recursive: true });
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

foldersToCopy.forEach((folder) => {
  const srcPath = path.join(rootDir, folder);
  const destPath = path.join(publicAwardsDir, folder);
  
  if (fs.existsSync(srcPath)) {
    console.log(`Copying ${folder} to public/assets/awards/${folder}...`);
    copyRecursiveSync(srcPath, destPath);
  } else {
    console.log(`[Warning] Source folder not found: ${srcPath}`);
  }
});

console.log('✅ All assets successfully copied into the portfolio directory!');
console.log('Now, you can deploy to Vercel without missing parent directory errors.');
