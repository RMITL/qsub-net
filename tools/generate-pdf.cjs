const fs = require('fs');
const { mdToPdf } = require('md-to-pdf');
const path = require('path');

async function generatePDF() {
  const inputPath = path.join(__dirname, 'QUANTA_Technical_Specification_v3.md');
  const outputPath = path.join(__dirname, 'QUANTA_Technical_Specification_v3.pdf');
  const stylesheetPath = path.join(__dirname, 'academic-style.css');

  console.log('Generating PDF...');
  console.log('Input:', inputPath);
  console.log('Output:', outputPath);
  console.log('Stylesheet:', stylesheetPath);

  try {
    const pdf = await mdToPdf(
      { path: inputPath },
      {
        dest: outputPath,
        stylesheet: [stylesheetPath],
        pdf_options: {
          format: 'Letter',
          margin: {
            top: '0.9in',
            bottom: '0.9in',
            left: '1in',
            right: '1in'
          },
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: '<div style="font-size: 8pt; font-family: sans-serif; color: #888; width: 100%; padding: 0 0.5in; display: flex; justify-content: space-between;"><span>QUANTA Technical Specification v3.0</span><span style="color: #c9a227;">CONFIDENTIAL</span></div>',
          footerTemplate: '<div style="font-size: 8pt; font-family: sans-serif; color: #888; width: 100%; text-align: center; padding: 0 0.5in;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
        },
        launch_options: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      }
    );

    console.log('PDF generated successfully:', outputPath);
    console.log('File size:', (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2), 'MB');
  } catch (err) {
    console.error('Error during PDF generation:', err.message);
    throw err;
  }
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
