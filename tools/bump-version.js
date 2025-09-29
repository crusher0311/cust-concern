const fs = require('fs');
const path = require('path');

function bumpVersion(v, type = 'patch') {
  const parts = v.split('.').map(Number);
  if (parts.length !== 3) throw new Error('Expected semver x.y.z');
  if (type === 'major') {
    parts[0] = parts[0] + 1;
    parts[1] = 0;
    parts[2] = 0;
  } else if (type === 'minor') {
    parts[1] = parts[1] + 1;
    parts[2] = 0;
  } else {
    // patch
    parts[2] = parts[2] + 1;
  }
  return parts.join('.');
}

function updateFile(filePath, field = 'version', type = 'patch') {
  const abs = path.resolve(filePath);
  const raw = fs.readFileSync(abs, 'utf8');
  const pkg = JSON.parse(raw);
  if (!pkg[field]) throw new Error(`No ${field} field in ${filePath}`);
  const old = pkg[field];
  pkg[field] = bumpVersion(old, type);
  fs.writeFileSync(abs, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log(`${filePath}: ${old} -> ${pkg[field]}`);
  return pkg[field];
}

function main() {
  try {
    const type = process.argv[2] || 'patch';
    const manifestPath = path.join(__dirname, '..', 'manifest.json');
    const packagePath = path.join(__dirname, '..', 'package.json');
    const newManifest = updateFile(manifestPath, 'version', type);
    const newPackage = updateFile(packagePath, 'version', type);
    console.log('Bumped manifest and package versions:', newManifest, newPackage);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

if (require.main === module) main();
