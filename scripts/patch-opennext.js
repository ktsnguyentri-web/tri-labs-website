import fs from 'fs';
import path from 'path';

const fileToPatch = path.join(process.cwd(), 'node_modules/@opennextjs/cloudflare/dist/cli/commands/build.js');
if (fs.existsSync(fileToPatch)) {
  let content = fs.readFileSync(fileToPatch, 'utf8');
  
  // First restore any incorrect replacements (like noMinify default)
  content = content.replace(
    '.option("noMinify", {\n        type: "boolean",\n        default: true,',
    '.option("noMinify", {\n        type: "boolean",\n        default: false,'
  );

  // Target dangerouslyUseUnsupportedNextVersion specifically
  content = content.replace(
    'option("dangerouslyUseUnsupportedNextVersion", {\n        type: "boolean",\n        default: false,',
    'option("dangerouslyUseUnsupportedNextVersion", {\n        type: "boolean",\n        default: true,'
  );
  
  fs.writeFileSync(fileToPatch, content, 'utf8');
  console.log('Successfully patched @opennextjs/cloudflare build command default value!');
} else {
  console.warn('Could not find file to patch:', fileToPatch);
}
