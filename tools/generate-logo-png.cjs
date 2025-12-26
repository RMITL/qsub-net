const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Generate multiple sizes for different use cases
const sizes = [
  { size: 44, name: 'quanta-logo-44' },   // Email signature
  { size: 64, name: 'quanta-logo-64' },   // Small icons
  { size: 128, name: 'quanta-logo-128' }, // Medium icons
  { size: 512, name: 'quanta-logo-512' }, // Large/retina
];

function createSVG(size) {
  // Use Arial as fallback since custom fonts won't render in sharp
  // The Q looks good in Arial Bold as well
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#f4d03f"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.1875}" fill="url(#gold)"/>
  <text x="${size / 2}" y="${size * 0.72}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${size * 0.5625}" fill="#0d0d14">Q</text>
</svg>`;
}

const outputDir = path.join(__dirname, '..', 'public', 'images');

async function generatePNGs() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating QUANTA logo PNGs...\n');

  for (const { size, name } of sizes) {
    const svgContent = createSVG(size);
    const outputPath = path.join(outputDir, `${name}.png`);

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(outputPath);

    const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(1);
    console.log(`  ${name}.png (${size}x${size}) - ${fileSize} KB`);
  }

  console.log(`\nPNGs generated in: ${outputDir}`);
  console.log('\nFor email signatures, use: https://qsub.net/images/quanta-logo-44.png');
}

generatePNGs().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
