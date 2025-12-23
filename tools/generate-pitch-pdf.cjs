const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://qsub.net';

// Helper function for delays (puppeteer v22+ removed waitForTimeout)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generatePitchPDF(pageUrl, outputName, slideCount) {
  const outputPath = path.join(__dirname, `${outputName}.pdf`);
  const publicOutputPath = path.join(__dirname, '..', 'public', 'docs', `${outputName}.pdf`);

  console.log(`\nGenerating ${outputName}...`);
  console.log('URL:', pageUrl);
  console.log('Output:', outputPath);
  console.log('Slides:', slideCount);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();

  // Set viewport to standard presentation size (16:9)
  await page.setViewport({ width: 1920, height: 1080 });

  // Navigate to the pitch deck
  await page.goto(pageUrl, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for React to hydrate
  await delay(2000);

  // Collect screenshots of each slide
  const screenshots = [];

  for (let i = 0; i < slideCount; i++) {
    console.log(`  Capturing slide ${i + 1}/${slideCount}...`);

    // Wait for any animations to complete
    await delay(400);

    // Take screenshot of current slide
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    screenshots.push(screenshot);

    // Navigate to next slide (press right arrow)
    if (i < slideCount - 1) {
      await page.keyboard.press('ArrowRight');
      await delay(300);
    }
  }

  await browser.close();

  // Create PDF by generating individual PDFs and combining
  console.log('  Combining into PDF...');

  const { PDFDocument } = require('pdf-lib');
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < screenshots.length; i++) {
    const pngImage = await pdfDoc.embedPng(screenshots[i]);
    // Standard 16:9 presentation size in points (1 point = 1/72 inch)
    const pageWidth = 1920 * 0.5; // Scale down for reasonable PDF size
    const pageHeight = 1080 * 0.5;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  // Copy to public folder
  const publicDir = path.dirname(publicOutputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.copyFileSync(outputPath, publicOutputPath);

  const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  console.log(`  Done! Size: ${fileSize} MB`);
  console.log(`  Copied to: ${publicOutputPath}`);

  return outputPath;
}

async function main() {
  console.log('=== QUANTA Pitch Deck PDF Generator ===\n');

  try {
    // Generate full pitch deck (25 slides)
    await generatePitchPDF(
      `${BASE_URL}/pitch`,
      'QUANTA_Pitch_Deck',
      25
    );

    // Generate lite pitch deck (12 slides)
    await generatePitchPDF(
      `${BASE_URL}/pitch-lite`,
      'QUANTA_Pitch_Deck_Lite',
      12
    );

    console.log('\n=== All PDFs generated successfully! ===');
  } catch (error) {
    console.error('Error generating PDFs:', error);
    process.exit(1);
  }
}

main();
