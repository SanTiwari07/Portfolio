const execSync = require('child_process').execSync;

try {
  const log = execSync('git log -n 2 --oneline', { encoding: 'utf-8' });
  console.log("Git Log:\n" + log);
  
  const status = execSync('git ls-files', { encoding: 'utf-8' });
  const aboutFiles = status.split('\n').filter(f => f.toLowerCase().includes('about.tsx'));
  console.log("About files in git:\n" + aboutFiles.join('\n'));
} catch (e) {
  console.log(e);
}
