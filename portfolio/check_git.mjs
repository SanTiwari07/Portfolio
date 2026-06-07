import { execSync } from 'child_process';

try {
  const status = execSync('git ls-files', { encoding: 'utf-8' });
  const aboutFiles = status.split('\n').filter(f => f.toLowerCase().includes('about.tsx'));
  console.log("All About.tsx files in Git:\n", aboutFiles.join('\n'));
  
  const commitLog = execSync('git log -n 1 --oneline', { encoding: 'utf-8' });
  console.log("\nLatest commit:", commitLog);
} catch (e) {
  console.log(e);
}
