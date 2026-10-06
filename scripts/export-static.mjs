import { copyFileSync, cpSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = resolve(projectRoot, 'dist');

mkdirSync(resolve(outputRoot, 'src/components'), { recursive: true });
mkdirSync(resolve(outputRoot, 'public'), { recursive: true });

copyFileSync(resolve(projectRoot, 'static-preview.html'), resolve(outputRoot, 'index.html'));
copyFileSync(resolve(projectRoot, 'src/styles.css'), resolve(outputRoot, 'src/styles.css'));
copyFileSync(resolve(projectRoot, 'src/components/BlurText.css'), resolve(outputRoot, 'src/components/BlurText.css'));
copyFileSync(resolve(projectRoot, 'src/components/ScrollFloat.css'), resolve(outputRoot, 'src/components/ScrollFloat.css'));
for (const entry of readdirSync(resolve(projectRoot, 'public'))) {
  cpSync(resolve(projectRoot, 'public', entry), resolve(outputRoot, 'public', entry), {
    recursive: true,
    force: true,
  });
}
writeFileSync(resolve(outputRoot, '.nojekyll'), '');

console.log('GitHub Pages files synced to dist.');
