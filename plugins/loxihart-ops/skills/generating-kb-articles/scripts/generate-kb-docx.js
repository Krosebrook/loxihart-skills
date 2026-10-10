#!/usr/bin/env node
/**
 * Loxihart KB Article Generator
 * Generates .docx files matching Loxihart-ReferenceGuideTemplate-2026.docx
 *
 * Usage: node generate-kb-docx.js <config.json> <output.docx> [--skill-dir /path/to/skill]
 *
 * Brand constants extracted from Loxihart template XML:
 *   Title: Bold, #00405F, 20pt, bottom rule
 *   H1: Roboto Condensed Medium, #0E2841, 24pt
 *   H2: Roboto Condensed Medium, #E2690E, 20pt
 *   H3: Roboto Condensed Medium, #0E2841, 18pt
 *   Body: Rubik, 11pt (22 half-pts)
 *   Warning: border/text #E2690E, fill #FFEBDE
 *   Info: border #5391AA, text #043854, fill #F5FBFF
 *   Table header: fill #00405F
 *   Table alt row: fill #F2F2F2
 *   Footer CONFIDENTIAL: #C00000
 */

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, HeadingLevel, LevelFormat,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber,
  PageBreak, TableOfContents, TabStopType, TabStopPosition,
  ExternalHyperlink
} = require("docx");

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node generate-kb-docx.js <config.json> <output.docx> [--skill-dir /path]");
  process.exit(1);
}

const configPath = args[0];
const outputPath = args[1];
let skillDir = __dirname;
const skillDirIdx = args.indexOf("--skill-dir");
if (skillDirIdx !== -1 && args[skillDirIdx + 1]) {
  skillDir = args[skillDirIdx + 1];
}

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const meta = config.metadata;

// ---------------------------------------------------------------------------
// Brand constants
// ---------------------------------------------------------------------------
const BRAND = {
  FONT_BODY: "Rubik",
  FONT_HEADING: "Roboto Condensed Medium",
  FONT_HEADING_BASE: "Roboto Condensed",
  COLOR_TITLE: "00405F",
  COLOR_H1: "0E2841",
  COLOR_H2: "E2690E",
  COLOR_H3: "0E2841",
  COLOR_BODY: "000000",
  COLOR_SUBTITLE: "808080",
  COLOR_WARNING_BORDER: "E2690E",
  COLOR_WARNING_FILL: "FFEBDE",
  COLOR_WARNING_TEXT: "E2690E",
  COLOR_INFO_BORDER: "5391AA",
  COLOR_INFO_FILL: "F5FBFF",
  COLOR_INFO_TEXT: "043854",
  COLOR_NOTE_BORDER: "DDDDDD",
  COLOR_TABLE_HEADER: "00405F",
  COLOR_TABLE_ALT: "F2F2F2",
  COLOR_TABLE_BORDER: "D9D9D9",
  COLOR_CONFIDENTIAL: "C00000",
  SIZE_BODY: 22,        // 11pt
  SIZE_TITLE: 40,       // 20pt
  SIZE_H1: 48,          // 24pt
  SIZE_H2: 40,          // 20pt
  SIZE_H3: 36,          // 18pt
  SIZE_H4: 32,          // 16pt
  SIZE_SUBTITLE: 20,    // 10pt
  SIZE_SMALL: 20,       // 10pt
  SIZE_FOOTER: 20,      // 10pt
  // Page dimensions (US Letter)
  PAGE_WIDTH: 12240,
  PAGE_HEIGHT: 15840,
  MARGIN_TOP: 432,
  MARGIN_RIGHT: 1008,
  MARGIN_BOTTOM: 864,
  MARGIN_LEFT: 720,
};

const CONTENT_WIDTH = BRAND.PAGE_WIDTH - BRAND.MARGIN_LEFT - BRAND.MARGIN_RIGHT; // 9360

// ---------------------------------------------------------------------------
// Resolve media paths
// ---------------------------------------------------------------------------
const mediaDir = path.join(skillDir, "templates", "media");
let logoData = null;
let logoType = "jpg";
let warningIconData = null;
let bestPracticeIconData = null;

// Try .jpg first (original template uses image5.jpg), fall back to .png
try { logoData = fs.readFileSync(path.join(mediaDir, "logo.jpg")); logoType = "jpg"; } catch (e) {
  try { logoData = fs.readFileSync(path.join(mediaDir, "logo.png")); logoType = "png"; } catch (e2) { /* no logo */ }
}
try { warningIconData = fs.readFileSync(path.join(mediaDir, "warning-icon.png")); } catch (e) { /* no icon */ }
try { bestPracticeIconData = fs.readFileSync(path.join(mediaDir, "bestpractice-icon.png")); } catch (e) { /* no icon */ }

// ---------------------------------------------------------------------------
// Numbering definitions
// ---------------------------------------------------------------------------
const numberingConfig = [
  {
    reference: "bullets",
    levels: [
      { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 1, format: LevelFormat.BULLET, text: "\u25CB", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1440, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 2, format: LevelFormat.BULLET, text: "\u25AA", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 2160, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 3, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 2880, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 4, format: LevelFormat.BULLET, text: "\u25CB", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 3600, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
    ],
  },
  {
    reference: "ordered",
    levels: [
      { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 1, format: LevelFormat.LOWER_LETTER, text: "%2.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1440, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 2, format: LevelFormat.LOWER_ROMAN, text: "%3.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 2160, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 3, format: LevelFormat.DECIMAL, text: "%4.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 2880, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 4, format: LevelFormat.LOWER_LETTER, text: "%5.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 3600, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
    ],
  },
  {
    reference: "checklist",
    levels: [
      { level: 0, format: LevelFormat.BULLET, text: "☐", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
    ],
  },
];

// ---------------------------------------------------------------------------
// Per-section ordered list numbering (resets numbering per section)
// ---------------------------------------------------------------------------
let orderedInstanceCounter = 0;
function getNextOrderedRef() {
  const ref = `ordered-${orderedInstanceCounter++}`;
  numberingConfig.push({
    reference: ref,
    levels: [
      { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 1, format: LevelFormat.LOWER_LETTER, text: "%2.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1440, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 2, format: LevelFormat.LOWER_ROMAN, text: "%3.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 2160, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 3, format: LevelFormat.DECIMAL, text: "%4.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 2880, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
      { level: 4, format: LevelFormat.LOWER_LETTER, text: "%5.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 3600, hanging: 360 } },
                 run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY } } },
    ],
  });
  return ref;
}

// ---------------------------------------------------------------------------
// Style definitions
// ---------------------------------------------------------------------------
const styles = {
  default: {
    document: {
      run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY },
      paragraph: { spacing: { line: 276, lineRule: "auto" } },
    },
  },
  paragraphStyles: [
    {
      id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: BRAND.FONT_HEADING, size: BRAND.SIZE_H1, color: BRAND.COLOR_H1 },
      paragraph: { keepNext: true, keepLines: true, spacing: { after: 0 }, outlineLevel: 0 },
    },
    {
      id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: BRAND.FONT_HEADING, size: BRAND.SIZE_H2, color: BRAND.COLOR_H2 },
      paragraph: { keepNext: true, keepLines: true, spacing: { after: 0 }, outlineLevel: 1 },
    },
    {
      id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: BRAND.FONT_HEADING, size: BRAND.SIZE_H3, color: BRAND.COLOR_H3 },
      paragraph: { keepNext: true, keepLines: true, spacing: { after: 0 }, outlineLevel: 2 },
    },
    {
      id: "Heading4", name: "Heading 4", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: BRAND.FONT_HEADING, size: BRAND.SIZE_H4, color: BRAND.COLOR_H3 },
      paragraph: { keepNext: true, keepLines: true, spacing: { after: 0 }, outlineLevel: 3 },
    },
    // TOC styles: H1 entries bold, H2+ entries italic and indented
    {
      id: "toc 1", name: "toc 1", basedOn: "Normal",
      run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY, bold: true },
      paragraph: { spacing: { before: 60, after: 20 },
        tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH, leader: "dot" }] },
    },
    {
      id: "toc 2", name: "toc 2", basedOn: "Normal",
      run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY, italics: true },
      paragraph: { spacing: { before: 0, after: 20 }, indent: { left: 360 },
        tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH, leader: "dot" }] },
    },
    {
      id: "toc 3", name: "toc 3", basedOn: "Normal",
      run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY, italics: true },
      paragraph: { spacing: { before: 0, after: 20 }, indent: { left: 720 },
        tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH, leader: "dot" }] },
    },
    {
      id: "toc 4", name: "toc 4", basedOn: "Normal",
      run: { font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY, italics: true },
      paragraph: { spacing: { before: 0, after: 20 }, indent: { left: 1080 },
        tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH, leader: "dot" }] },
    },
  ],
};

// ---------------------------------------------------------------------------
// Helper: standard border set
// ---------------------------------------------------------------------------
function tableBorders(color = BRAND.COLOR_TABLE_BORDER) {
  const b = { style: BorderStyle.SINGLE, size: 4, color };
  return { top: b, bottom: b, left: b, right: b, insideH: b, insideV: b };
}

function cellBorders(color = BRAND.COLOR_TABLE_BORDER) {
  const b = { style: BorderStyle.SINGLE, size: 4, color };
  return { top: b, bottom: b, left: b, right: b };
}

const cellMargins = { top: 29, bottom: 29, left: 120, right: 120 };

// ---------------------------------------------------------------------------
// Helper: callout box paragraph
// ---------------------------------------------------------------------------
function createCalloutBox(type, text) {
  let borderColor, fillColor, textColor, icon, iconFont;
  if (type === "warning") {
    borderColor = BRAND.COLOR_WARNING_BORDER;
    fillColor = BRAND.COLOR_WARNING_FILL;
    textColor = BRAND.COLOR_WARNING_TEXT;
    icon = "\u26A0";
    iconFont = "Segoe UI Symbol";
  } else if (type === "info") {
    borderColor = BRAND.COLOR_INFO_BORDER;
    fillColor = BRAND.COLOR_INFO_FILL;
    textColor = BRAND.COLOR_INFO_TEXT;
    icon = "\u24D8";
    iconFont = "MS Mincho";
  } else {
    // best practice — top/bottom borders only, NoteBox style
    const border = { style: BorderStyle.SINGLE, size: 4, color: BRAND.COLOR_NOTE_BORDER, space: 12 };
    const noBorder = { style: BorderStyle.NONE, size: 0, color: "auto" };
    return new Paragraph({
      border: { top: border, bottom: { ...border, space: 6 }, left: noBorder, right: noBorder },
      spacing: { before: 120, after: 120 },
      indent: { left: 810, hanging: 810 },
      children: [
        new TextRun({ text: "\u2605 ", font: "Segoe UI Symbol", size: BRAND.SIZE_BODY }),
        new TextRun({ text, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
      ],
    });
  }

  // Warning and info boxes: bordered box with fill, matching original template XML
  const border = { style: BorderStyle.SINGLE, size: 4, color: borderColor, space: 6 };
  return new Paragraph({
    border: { top: border, bottom: border, left: border, right: border },
    shading: { type: ShadingType.CLEAR, fill: fillColor },
    spacing: { before: 100, after: 100, line: 276, lineRule: "auto" },
    indent: { left: 187, right: 274 },
    children: [
      new TextRun({ text: icon + " ", font: iconFont, color: textColor, size: 24 }),
      new TextRun({ text, font: "Rubik Medium", color: textColor, size: BRAND.SIZE_SMALL }),
    ],
  });
}

// ---------------------------------------------------------------------------
// Helper: Loxihart-styled table
// ---------------------------------------------------------------------------
function createIntTable(headers, rows, columnWidths = null) {
  const colCount = headers.length;
  const colWidth = columnWidths
    ? columnWidths
    : Array(colCount).fill(Math.floor(CONTENT_WIDTH / colCount));
  const tableWidth = colWidth.reduce((a, b) => a + b, 0);

  const headerRow = new TableRow({
    tableHeader: true,
    height: { value: 360, rule: "atLeast" },
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: colWidth[i], type: WidthType.DXA },
        borders: cellBorders(),
        shading: { type: ShadingType.CLEAR, fill: BRAND.COLOR_TABLE_HEADER },
        verticalAlign: VerticalAlign.CENTER,
        margins: cellMargins,
        children: [
          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: h, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY, color: "FFFFFF" }),
            ],
          }),
        ],
      })
    ),
  });

  const dataRows = rows.map((row, rowIdx) =>
    new TableRow({
      children: row.map((cell, i) =>
        new TableCell({
          width: { size: colWidth[i], type: WidthType.DXA },
          borders: cellBorders(),
          shading: rowIdx % 2 === 1
            ? { type: ShadingType.CLEAR, fill: BRAND.COLOR_TABLE_ALT }
            : undefined,
          verticalAlign: VerticalAlign.CENTER,
          margins: cellMargins,
          children: [
            new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({ text: String(cell), font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
              ],
            }),
          ],
        })
      ),
    })
  );

  return new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: colWidth,
    rows: [headerRow, ...dataRows],
  });
}

// ---------------------------------------------------------------------------
// Helper: body paragraph
// ---------------------------------------------------------------------------
function bodyPara(text, opts = {}) {
  const children = [];
  if (typeof text === "string") {
    children.push(new TextRun({
      text,
      font: opts.font || BRAND.FONT_BODY,
      size: opts.size || BRAND.SIZE_BODY,
      bold: opts.bold || false,
      italics: opts.italics || false,
      color: opts.color || undefined,
    }));
  }
  return new Paragraph({
    spacing: opts.spacing || { after: 200 },
    indent: opts.indent || undefined,
    alignment: opts.alignment || undefined,
    children,
  });
}

// ---------------------------------------------------------------------------
// Helper: bullet list items
// ---------------------------------------------------------------------------
function bulletItems(items, reference = "bullets", level = 0) {
  return items.map(item =>
    new Paragraph({
      numbering: { reference, level },
      children: [new TextRun({ text: item, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY })],
    })
  );
}

function orderedItems(items, reference = "ordered", level = 0) {
  return items.map(item =>
    new Paragraph({
      numbering: { reference, level },
      children: [new TextRun({ text: item, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY })],
    })
  );
}

// ---------------------------------------------------------------------------
// Helper: code block
// ---------------------------------------------------------------------------
function codeBlock(code) {
  const lines = code.split("\n");
  return lines.map(line =>
    new Paragraph({
      shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
      spacing: { after: 0 },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({ text: line || " ", font: "Consolas", size: 18, color: "333333" }),
      ],
    })
  );
}

// ---------------------------------------------------------------------------
// Build: Cover Page
// ---------------------------------------------------------------------------
function buildCoverPage() {
  const children = [];

  // Title with bottom border
  children.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" } },
    spacing: { after: 0, line: 276, lineRule: "auto" },
    children: [
      new TextRun({
        text: meta.title,
        bold: true,
        color: BRAND.COLOR_TITLE,
        size: BRAND.SIZE_TITLE,
        font: BRAND.FONT_BODY,
      }),
    ],
  }));

  // Subtitle - "Created by Loxihart [Department] Team; Month Year"
  children.push(new Paragraph({
    spacing: { line: 276, lineRule: "auto" },
    children: [
      new TextRun({
        text: `Created by Loxihart ${meta.department} Team; ${meta.created_date}`,
        italics: true,
        color: BRAND.COLOR_SUBTITLE,
        size: BRAND.SIZE_SUBTITLE,
        font: BRAND.FONT_BODY,
      }),
    ],
  }));

  // Intro paragraph
  if (config.metadata.intro_paragraph) {
    const paras = config.metadata.intro_paragraph.split("\n\n");
    paras.forEach(p => children.push(bodyPara(p)));
  }

  // Callout legend
  children.push(new Paragraph({
    spacing: { before: 120, after: 200 },
    children: [
      new TextRun({ text: "Included in this document are important warnings (", italics: true, size: BRAND.SIZE_SMALL, font: BRAND.FONT_BODY }),
      new TextRun({ text: "\u26A0", font: "Segoe UI Symbol", size: BRAND.SIZE_SMALL }),
      new TextRun({ text: " icon), information callouts (", italics: true, size: BRAND.SIZE_SMALL, font: BRAND.FONT_BODY }),
      new TextRun({ text: "\u24D8", font: "Segoe UI Symbol", size: BRAND.SIZE_SMALL }),
      new TextRun({ text: " icon) and recommended best practices (", italics: true, size: BRAND.SIZE_SMALL, font: BRAND.FONT_BODY }),
      new TextRun({ text: "\u2605", font: "Segoe UI Symbol", size: BRAND.SIZE_SMALL }),
      new TextRun({ text: " icon).", italics: true, size: BRAND.SIZE_SMALL, font: BRAND.FONT_BODY }),
    ],
  }));

  return children;
}

// ---------------------------------------------------------------------------
// Build: Important Links
// ---------------------------------------------------------------------------
function buildImportantLinks() {
  const children = [];
  children.push(new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: "Important Links", bold: true, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
    ],
  }));

  if (config.important_links && config.important_links.length > 0) {
    config.important_links.forEach(link => {
      if (link.url) {
        children.push(new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [
            new ExternalHyperlink({
              children: [new TextRun({ text: link.text, style: "Hyperlink", font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY })],
              link: link.url,
            }),
          ],
        }));
      } else {
        children.push(...bulletItems([link.text]));
      }
    });
  } else {
    children.push(...bulletItems(["[Insert Important Links Here]"]));
  }

  return children;
}

// ---------------------------------------------------------------------------
// Build: Contact Us
// ---------------------------------------------------------------------------
function buildContactUs() {
  return [
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Contact Us! ", bold: true, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
        new TextRun({ text: `You can reach the Loxihart ${meta.department} Support Team by emailing `, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
        new TextRun({ text: meta.support_email || "[[EMAIL]]", bold: true, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
        new TextRun({ text: ".", font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
      ],
    }),
  ];
}

// ---------------------------------------------------------------------------
// Build: Table of Contents (manual entries with page numbers + field code)
// ---------------------------------------------------------------------------
function buildTOC() {
  const children = [];

  // TOC title — styled as H1 but separated from horizontal rule
  children.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND.COLOR_TABLE_BORDER } },
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: "Table of Contents",
        font: BRAND.FONT_HEADING,
        size: BRAND.SIZE_H1,
        color: BRAND.COLOR_H1,
      }),
    ],
  }));

  // Collect all section titles + optional descriptions for manual TOC
  const tocEntries = [];

  // Cover page, Important Links, Contact Us are always present
  tocEntries.push({ title: "Cover Page", level: 1 });

  // Primary content sections
  if (config.sections) {
    config.sections.forEach(section => {
      tocEntries.push({ title: section.title, level: 1, description: section.toc_description || null });
      if (section.subsections) {
        section.subsections.forEach(sub => {
          tocEntries.push({ title: sub.title, level: 2, description: sub.toc_description || null });
          if (sub.subsections) {
            sub.subsections.forEach(subsub => {
              tocEntries.push({ title: subsub.title, level: 3, description: subsub.toc_description || null });
            });
          }
        });
      }
    });
  }

  // Optional structural sections
  if (config.decision_tree) tocEntries.push({ title: "Decision Tree", level: 1 });
  if (config.prerequisites && config.prerequisites.length > 0) tocEntries.push({ title: "Requirements & Prerequisites", level: 1 });
  if (config.verification_items && config.verification_items.length > 0) tocEntries.push({ title: "Validation & Verification", level: 1 });
  if (config.escalation_matrix && config.escalation_matrix.length > 0) tocEntries.push({ title: "Escalation & Exception Handling", level: 1 });
  if (config.raci) tocEntries.push({ title: "Responsibility Matrix (RACI)", level: 1 });
  tocEntries.push({ title: "Version History", level: 1 });
  if (config.appendices && config.appendices.length > 0) {
    tocEntries.push({ title: "Appendices", level: 1 });
    config.appendices.forEach((appendix, i) => {
      const letter = String.fromCharCode(65 + i);
      tocEntries.push({ title: `Appendix ${letter}: ${appendix.title}`, level: 2 });
    });
  }
  if (config.assumptions && config.assumptions.length > 0) tocEntries.push({ title: "Assumptions & Limitations", level: 1 });

  // Estimate page numbers (rough: cover=1, TOC=2, content starts at 3, ~1 page per H1 section)
  let pageEstimate = 2; // TOC page
  let lastH1Page = 3;   // content starts after TOC

  // Render manual TOC entries
  tocEntries.forEach((entry, idx) => {
    const isH1 = entry.level === 1;
    const indent = (entry.level - 1) * 360;

    // Estimate page: H1s get incrementing pages, H2+ share parent's page
    if (isH1) {
      pageEstimate = lastH1Page;
      lastH1Page++;
    }

    // Title line with dot leader → page number
    const titleRuns = [
      new TextRun({
        text: entry.title,
        font: BRAND.FONT_BODY,
        size: BRAND.SIZE_BODY,
        bold: isH1,
        italics: !isH1,
      }),
      new TextRun({ text: "\t", font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
      new TextRun({
        text: String(pageEstimate),
        font: BRAND.FONT_BODY,
        size: BRAND.SIZE_BODY,
        bold: isH1,
        italics: !isH1,
      }),
    ];

    children.push(new Paragraph({
      spacing: { before: isH1 ? 60 : 0, after: entry.description ? 0 : 20 },
      indent: indent > 0 ? { left: indent } : undefined,
      tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH, leader: "dot" }],
      children: titleRuns,
    }));

    // Optional description line (italic, smaller, no dot leader)
    if (entry.description) {
      children.push(new Paragraph({
        spacing: { before: 0, after: 20 },
        indent: { left: indent + 180 },
        children: [
          new TextRun({
            text: entry.description,
            font: BRAND.FONT_BODY,
            size: BRAND.SIZE_SMALL,
            italics: true,
            color: BRAND.COLOR_SUBTITLE,
          }),
        ],
      }));
    }
  });

  // Hidden Word TOC field code — users can "Update Field" for accurate page numbers
  children.push(new Paragraph({ spacing: { before: 120, after: 0 }, children: [
    new TextRun({ text: "", size: 2 }), // near-invisible spacer
  ] }));
  children.push(new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: "1-4",
  }));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  return children;
}

// ---------------------------------------------------------------------------
// Build: Primary Content Sections
// ---------------------------------------------------------------------------
function buildSections() {
  const children = [];
  if (!config.sections) return children;

  config.sections.forEach((section, sIdx) => {
    // H1
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: section.title })],
    }));

    if (section.content) {
      children.push(bodyPara(section.content));
    }

    // Subsections
    if (section.subsections) {
      section.subsections.forEach(sub => {
        // H2
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: sub.title })],
        }));

        if (sub.content) {
          const paras = sub.content.split("\n\n");
          paras.forEach(p => children.push(bodyPara(p)));
        }

        // Callouts
        if (sub.callouts && sub.callouts.length > 0) {
          sub.callouts.forEach((c, cIdx) => {
            children.push(createCalloutBox(c.type, c.text));
          });
        }

        // Steps — each subsection gets a fresh numbering sequence
        if (sub.steps && sub.steps.length > 0) {
          const stepRef = getNextOrderedRef();
          sub.steps.forEach((step, i) => {
            children.push(new Paragraph({
              numbering: { reference: stepRef, level: 0 },
              children: [new TextRun({ text: step.action, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY })],
            }));
            if (step.expected_result) {
              children.push(new Paragraph({
                indent: { left: 720 },
                children: [
                  new TextRun({ text: "Expected Result: ", bold: true, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
                  new TextRun({ text: step.expected_result, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
                ],
              }));
            }
          });
        }

        // Code blocks
        if (sub.code_blocks) {
          sub.code_blocks.forEach(cb => {
            children.push(bodyPara("")); // spacer
            children.push(...codeBlock(cb.code));
            children.push(bodyPara("")); // spacer
          });
        }

        // Tables
        if (sub.tables) {
          sub.tables.forEach(t => {
            children.push(bodyPara("")); // spacer
            children.push(createIntTable(t.headers, t.rows, t.columnWidths || null));
            children.push(bodyPara("")); // spacer
          });
        }

        // Sub-subsections (H3)
        if (sub.subsections) {
          sub.subsections.forEach(subsub => {
            children.push(new Paragraph({
              heading: HeadingLevel.HEADING_3,
              children: [new TextRun({ text: subsub.title })],
            }));
            if (subsub.content) {
              const paras = subsub.content.split("\n\n");
              paras.forEach(p => children.push(bodyPara(p)));
            }
          });
        }
      });
    }
  });

  return children;
}

// ---------------------------------------------------------------------------
// Build: Decision Tree
// ---------------------------------------------------------------------------
function buildDecisionTree() {
  if (!config.decision_tree) return [];
  const children = [];
  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: "Decision Tree" })],
  }));

  children.push(bodyPara(`START: ${config.decision_tree.start}`));

  if (config.decision_tree.paths) {
    config.decision_tree.paths.forEach(p => {
      children.push(bodyPara(`\u2502`, { spacing: { after: 0 } }));
      children.push(bodyPara(`\u251C\u25BA ${p.condition}`, { spacing: { after: 0 } }));
      if (p.yes_path) {
        children.push(bodyPara(`\u2502   \u251C\u25BA YES \u2192 ${p.yes_path}`, { spacing: { after: 0 } }));
      }
      if (p.no_path) {
        children.push(bodyPara(`\u2502   \u2514\u25BA NO \u2192 ${p.no_path}`, { spacing: { after: 0 } }));
      }
      if (p.outcomes) {
        p.outcomes.forEach((o, i) => {
          const prefix = i < p.outcomes.length - 1 ? "\u251C\u25BA" : "\u2514\u25BA";
          children.push(bodyPara(`\u2502   ${prefix} ${o}`, { spacing: { after: 0 } }));
        });
      }
    });
  }

  children.push(bodyPara("")); // spacer
  return children;
}

// ---------------------------------------------------------------------------
// Build: Prerequisites
// ---------------------------------------------------------------------------
function buildPrerequisites() {
  if (!config.prerequisites || config.prerequisites.length === 0) return [];
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: "Requirements & Prerequisites" })],
    }),
    ...config.prerequisites.map(item =>
      new Paragraph({
        numbering: { reference: "checklist", level: 0 },
        children: [new TextRun({ text: item, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY })],
      })
    ),
    bodyPara(""),
  ];
}

// ---------------------------------------------------------------------------
// Build: Verification
// ---------------------------------------------------------------------------
function buildVerification() {
  if (!config.verification_items || config.verification_items.length === 0) return [];
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: "Validation & Verification" })],
    }),
    ...config.verification_items.map(item =>
      new Paragraph({
        numbering: { reference: "checklist", level: 0 },
        children: [new TextRun({ text: item, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY })],
      })
    ),
    bodyPara(""),
  ];
}

// ---------------------------------------------------------------------------
// Build: Escalation Matrix
// ---------------------------------------------------------------------------
function buildEscalation() {
  if (!config.escalation_matrix || config.escalation_matrix.length === 0) return [];
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: "Escalation & Exception Handling" })],
    }),
    createIntTable(
      ["Condition", "Action / Escalate To", "Priority / Timeline"],
      config.escalation_matrix.map(e => [e.condition, e.action, e.priority])
    ),
    bodyPara(""),
  ];
}

// ---------------------------------------------------------------------------
// Build: RACI
// ---------------------------------------------------------------------------
function buildRACI() {
  if (!config.raci) return [];
  const headers = ["Task / Activity", ...config.raci.roles];
  const rows = config.raci.tasks.map(t => {
    return [t.task, ...config.raci.roles.map(r => t.assignments[r] || "")];
  });

  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: "Responsibility Matrix (RACI)" })],
    }),
    bodyPara("R = Responsible (does the work) | A = Accountable (final approval) | C = Consulted (provides input) | I = Informed (kept updated)"),
    createIntTable(headers, rows),
    bodyPara(""),
  ];
}

// ---------------------------------------------------------------------------
// Build: Version History
// ---------------------------------------------------------------------------
function buildVersionHistory() {
  const history = config.version_history || [
    { version: "1.0.0", date: new Date().toISOString().slice(0, 10), author: meta.department, changes: "Initial publication" },
  ];

  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: "Version History" })],
    }),
    createIntTable(
      ["Version", "Date", "Author", "Changes"],
      history.map(h => [h.version, h.date, h.author, h.changes])
    ),
    bodyPara(""),
  ];
}

// ---------------------------------------------------------------------------
// Build: Appendices
// ---------------------------------------------------------------------------
function buildAppendices() {
  if (!config.appendices || config.appendices.length === 0) return [];
  const children = [];
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: "Appendices" })],
  }));

  config.appendices.forEach((appendix, i) => {
    const letter = String.fromCharCode(65 + i);
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: `Appendix ${letter}: ${appendix.title}` })],
    }));
    if (appendix.content) {
      const paras = appendix.content.split("\n\n");
      paras.forEach(p => children.push(bodyPara(p)));
    }
    if (appendix.code) {
      children.push(...codeBlock(appendix.code));
    }
  });

  return children;
}

// ---------------------------------------------------------------------------
// Build: Assumptions
// ---------------------------------------------------------------------------
function buildAssumptions() {
  if (!config.assumptions || config.assumptions.length === 0) return [];
  const children = [];
  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text: "Assumptions & Limitations" })],
  }));

  config.assumptions.forEach(a => {
    children.push(...bulletItems([`${a.label}: ${a.description}`]));
  });

  return children;
}

// ---------------------------------------------------------------------------
// Build: Header
// ---------------------------------------------------------------------------
function buildHeader() {
  const headerChildren = [];

  // Logo on its own line, left-aligned
  if (logoData) {
    headerChildren.push(new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new ImageRun({
          type: logoType,
          data: logoData,
          transformation: { width: 82, height: 55 },
          altText: { title: "Loxihart Logo", description: "Loxihart Inc. company logo", name: "Loxihart Logo" },
        }),
        // Tab to right side for department info
        new TextRun({ text: "\t", size: BRAND.SIZE_BODY }),
        new TextRun({ text: `Loxihart ${meta.department}`, bold: true, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }],
    }));

    // Category line, right-aligned
    if (meta.category) {
      headerChildren.push(new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: meta.category, font: BRAND.FONT_BODY, size: BRAND.SIZE_SMALL }),
        ],
      }));
    }
  } else {
    // No logo — just department info right-aligned
    headerChildren.push(new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({ text: `Loxihart ${meta.department}`, bold: true, font: BRAND.FONT_BODY, size: BRAND.SIZE_BODY }),
      ],
    }));
    if (meta.category) {
      headerChildren.push(new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: meta.category, font: BRAND.FONT_BODY, size: BRAND.SIZE_SMALL }),
        ],
      }));
    }
  }

  // Empty spacer paragraph
  headerChildren.push(new Paragraph({ children: [] }));

  return new Header({ children: headerChildren });
}

// ---------------------------------------------------------------------------
// Build: Footer
// ---------------------------------------------------------------------------
function buildFooter() {
  const year = new Date().getFullYear();

  return new Footer({
    children: [
      // Line 1: Copyright left, CONFIDENTIAL center, Page right
      new Paragraph({
        spacing: { before: 120 },
        tabStops: [
          { type: TabStopType.CENTER, position: Math.floor(CONTENT_WIDTH / 2) },
          { type: TabStopType.RIGHT, position: CONTENT_WIDTH },
        ],
        children: [
          new TextRun({ text: `Copyright \u00A9 Loxihart Inc. ${year}`, size: BRAND.SIZE_FOOTER, font: BRAND.FONT_BODY }),
          new TextRun({ text: "\t" }),
          new TextRun({ text: "CONFIDENTIAL", bold: true, color: BRAND.COLOR_CONFIDENTIAL, size: BRAND.SIZE_FOOTER, font: BRAND.FONT_BODY }),
          new TextRun({ text: "\t" }),
          new TextRun({ text: "Page | ", size: BRAND.SIZE_FOOTER, font: BRAND.FONT_BODY }),
          new TextRun({ children: [PageNumber.CURRENT], size: BRAND.SIZE_FOOTER, font: BRAND.FONT_BODY }),
        ],
      }),
      // Line 2: "All Rights Reserved." left-aligned
      new Paragraph({
        children: [
          new TextRun({ text: "All Rights Reserved.", size: BRAND.SIZE_FOOTER, font: BRAND.FONT_BODY }),
        ],
      }),
    ],
  });
}

// ---------------------------------------------------------------------------
// Assemble document
// ---------------------------------------------------------------------------
const docChildren = [
  ...buildCoverPage(),
  ...buildImportantLinks(),
  ...buildContactUs(),
  ...buildTOC(),
  ...buildSections(),
  ...buildDecisionTree(),
  ...buildPrerequisites(),
  ...buildVerification(),
  ...buildEscalation(),
  ...buildRACI(),
  ...buildVersionHistory(),
  ...buildAppendices(),
  ...buildAssumptions(),
];

const doc = new Document({
  styles,
  numbering: { config: numberingConfig },
  sections: [
    {
      properties: {
        page: {
          size: { width: BRAND.PAGE_WIDTH, height: BRAND.PAGE_HEIGHT },
          margin: {
            top: BRAND.MARGIN_TOP,
            right: BRAND.MARGIN_RIGHT,
            bottom: BRAND.MARGIN_BOTTOM,
            left: BRAND.MARGIN_LEFT,
          },
        },
      },
      headers: { default: buildHeader() },
      footers: { default: buildFooter() },
      children: docChildren,
    },
  ],
});

// ---------------------------------------------------------------------------
// Generate
// ---------------------------------------------------------------------------
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
}).catch(err => {
  console.error("Generation failed:", err);
  process.exit(1);
});
