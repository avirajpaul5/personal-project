const { execSync } = require('child_process');

try {
  const output = execSync('npx tsc --noEmit', { encoding: 'utf8' });
  console.log('No TypeScript errors found!');
} catch (error) {
  console.error('TypeScript errors found:');
  console.error(error.stdout);
}
