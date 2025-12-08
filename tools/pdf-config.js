module.exports = {
  stylesheet: [
    `
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Source+Sans+Pro:wght@400;600&family=Source+Code+Pro:wght@400;500&display=swap');

    :root {
      --primary-color: #1a365d;
      --accent-color: #d4af37;
      --text-color: #2d3748;
      --light-gray: #e2e8f0;
    }

    body {
      font-family: 'Source Serif Pro', Georgia, serif;
      font-size: 11pt;
      line-height: 1.6;
      color: var(--text-color);
      max-width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Cover Page */
    .cover-page {
      page-break-after: always;
      text-align: center;
      padding-top: 3in;
    }

    /* Headers */
    h1 {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 24pt;
      font-weight: 700;
      color: var(--primary-color);
      border-bottom: 3px solid var(--accent-color);
      padding-bottom: 0.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      page-break-after: avoid;
    }

    h2 {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 18pt;
      font-weight: 600;
      color: var(--primary-color);
      border-bottom: 1px solid var(--light-gray);
      padding-bottom: 0.3rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      page-break-after: avoid;
    }

    h3 {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 14pt;
      font-weight: 600;
      color: var(--primary-color);
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
      page-break-after: avoid;
    }

    h4 {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 12pt;
      font-weight: 600;
      color: #4a5568;
      margin-top: 1rem;
      margin-bottom: 0.4rem;
      page-break-after: avoid;
    }

    /* Abstract & Executive Summary special styling */
    h2:first-of-type + p,
    #abstract + p {
      font-style: italic;
      text-align: justify;
    }

    /* Paragraphs */
    p {
      text-align: justify;
      margin-bottom: 0.75rem;
      orphans: 3;
      widows: 3;
    }

    /* Lists */
    ul, ol {
      margin-left: 1.5rem;
      margin-bottom: 0.75rem;
    }

    li {
      margin-bottom: 0.25rem;
    }

    /* Code blocks */
    pre {
      background: #f7fafc;
      border: 1px solid var(--light-gray);
      border-radius: 4px;
      padding: 1rem;
      font-family: 'Source Code Pro', monospace;
      font-size: 9pt;
      overflow-x: auto;
      page-break-inside: avoid;
    }

    code {
      font-family: 'Source Code Pro', monospace;
      font-size: 9pt;
      background: #f7fafc;
      padding: 0.1rem 0.3rem;
      border-radius: 3px;
    }

    pre code {
      background: none;
      padding: 0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }

    th {
      background: var(--primary-color);
      color: white;
      font-family: 'Source Sans Pro', sans-serif;
      font-weight: 600;
      padding: 0.5rem;
      text-align: left;
      border: 1px solid var(--primary-color);
    }

    td {
      padding: 0.4rem 0.5rem;
      border: 1px solid var(--light-gray);
    }

    tr:nth-child(even) {
      background: #f7fafc;
    }

    /* Blockquotes - for callouts/notes */
    blockquote {
      border-left: 4px solid var(--accent-color);
      background: #fffbeb;
      margin: 1rem 0;
      padding: 0.75rem 1rem;
      font-style: italic;
      page-break-inside: avoid;
    }

    /* Horizontal rules */
    hr {
      border: none;
      border-top: 1px solid var(--light-gray);
      margin: 1.5rem 0;
    }

    /* Links */
    a {
      color: var(--primary-color);
      text-decoration: none;
    }

    /* Math/formulas - make them stand out */
    .math, .formula {
      background: #f7fafc;
      padding: 0.5rem;
      border-radius: 4px;
      font-family: 'Source Code Pro', monospace;
      display: block;
      margin: 0.5rem 0;
      text-align: center;
    }

    /* Page breaks */
    .page-break {
      page-break-after: always;
    }

    /* Strong/emphasis for key terms */
    strong {
      color: var(--primary-color);
    }

    /* Figure captions */
    figcaption, .caption {
      font-size: 9pt;
      font-style: italic;
      text-align: center;
      color: #718096;
      margin-top: 0.5rem;
    }

    /* Notation section */
    .notation-table td:first-child {
      font-family: 'Source Code Pro', monospace;
      font-weight: 500;
      width: 120px;
    }

    /* TOC styling */
    .toc a {
      color: var(--text-color);
    }

    .toc ul {
      list-style: none;
      margin-left: 0;
    }

    .toc > ul > li {
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .toc > ul > li > ul > li {
      font-weight: 400;
      margin-left: 1rem;
    }
    `
  ],
  body_class: 'technical-spec',
  pdf_options: {
    format: 'Letter',
    margin: {
      top: '1in',
      bottom: '1in',
      left: '1in',
      right: '1in'
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 9pt; font-family: 'Source Sans Pro', sans-serif; color: #718096; width: 100%; padding: 0 1in;">
        <span style="float: left;">QUANTA Technical Specification v3.0</span>
        <span style="float: right;">CONFIDENTIAL</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 9pt; font-family: 'Source Sans Pro', sans-serif; color: #718096; width: 100%; padding: 0 1in; text-align: center;">
        <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>
    `
  },
  marked_options: {
    headerIds: true,
    smartLists: true,
    gfm: true
  }
};
