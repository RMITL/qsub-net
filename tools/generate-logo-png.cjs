const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SIZE = 512;

// Create SVG at the target size for better quality
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#f4d03f"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" rx="${SIZE * 0.1875}" fill="url(#gold)"/>
  <text x="${SIZE / 2}" y="${SIZE * 0.72}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${SIZE * 0.5625}" fill="#0d0d14">Q</text>
</svg>`;

const outputPath = path.join(__dirname, '..', 'public', 'quanta-logo-512.png');

async function generatePNG() {
  console.log('Generating 512x512 PNG logo...');

  await sharp(Buffer.from(svgContent))
    .resize(SIZE, SIZE)
    .png()
    .toFile(outputPath);

  console.log('PNG generated:', outputPath);
  console.log('File size:', (fs.statSync(outputPath).size / 1024).toFixed(1), 'KB');
}

generatePNG().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
