const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WIDTH = 1500;
const HEIGHT = 500;

// X/Twitter header with QUANTA wordmark and tagline
// Using embedded font styling for reliability
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="50%" stop-color="#12121a"/>
      <stop offset="100%" stop-color="#0a0a0f"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#f4d03f"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>

  <!-- Subtle grid pattern -->
  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(212,175,55,0.03)" stroke-width="1"/>
  </pattern>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <!-- QUANTA wordmark -->
  <text x="750" y="230" text-anchor="middle" fill="url(#goldGrad)"
        font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="120" letter-spacing="18">QUANTA</text>

  <!-- Tagline -->
  <text x="750" y="310" text-anchor="middle" fill="rgba(232,230,227,0.85)"
        font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="28" letter-spacing="1.5">Decentralized Alpha Subnet</text>

  <!-- Subtle decorative line -->
  <rect x="550" y="340" width="400" height="1" fill="url(#goldGrad)" opacity="0.4"/>
</svg>`;

const outputPath = path.join(__dirname, '..', 'public', 'quanta-x-header.png');

async function generatePNG() {
  console.log('Generating X/Twitter header (1500x500)...');

  await sharp(Buffer.from(svgContent))
    .resize(WIDTH, HEIGHT)
    .png()
    .toFile(outputPath);

  console.log('PNG generated:', outputPath);
  console.log('File size:', (fs.statSync(outputPath).size / 1024).toFixed(1), 'KB');
}

generatePNG().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
