const { execSync } = require('child_process');

try {
  console.log('Rebuilding sqlite3 from source...');
  execSync('npm rebuild sqlite3 --build-from-source', { stdio: 'inherit' });
  console.log('sqlite3 rebuild complete.');
} catch (error) {
  console.error('Failed to rebuild sqlite3:', error.message);
  process.exit(1);
}
