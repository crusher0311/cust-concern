// Node script to generate resized icons from images/logo.png
// Usage: node tools/generate-icons.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [16, 48, 128];
const root = path.join(__dirname, '..');
const imagePath = path.join(root, 'images', 'logo.png');

if (!fs.existsSync(imagePath)) {
  console.error('Source logo not found at', imagePath);
  process.exit(1);
}

(async () => {
  try {
    for (const size of sizes) {
      const out = path.join(root, 'images', `icon${size}.png`);
      await sharp(imagePath)
        .resize(size, size, { fit: 'cover' })
        .toFile(out);
      console.log('Wrote', out);
    }
    console.log('All icons generated.');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
})();
