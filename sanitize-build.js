import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');

function sanitizeFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove crossorigin attribute from stylesheet links to allow local file:// loading
  content = content.replace(/<link rel="stylesheet" crossorigin href=/g, '<link rel="stylesheet" href=');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[BUILD POLISH] Sanitized stylesheet crossorigin on: ${path.basename(filePath)}`);
}

sanitizeFile(path.resolve(distDir, 'index.html'));
sanitizeFile(path.resolve(distDir, '404.html'));
