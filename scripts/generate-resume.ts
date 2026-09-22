import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateResume() {
  const doc = await PDFDocument.create();
  
  // Standard US Letter: 8.5 x 11 inches (612 x 792 points)
  const width = 612;
  const height = 792;
  const page = doc.addPage([width, height]);

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);
  const fontBoldOblique = await doc.embedFont(StandardFonts.HelveticaBoldOblique);

  // Palette matching the uploaded resume exactly
  const tealColor = rgb(0.14, 0.44, 0.38);       // #247061
  const darkTextColor = rgb(0.13, 0.13, 0.13);   // #222222
  const bodyTextColor = rgb(0.20, 0.20, 0.20);   // #333333
  const mutedTextColor = rgb(0.38, 0.38, 0.38);  // #606060
  const linkColor = rgb(0.11, 0.36, 0.58);       // Blue-teal for links
  const ruleColor = rgb(0.14, 0.44, 0.38);       // Matching teal header line

  const marginX = 42;
  const contentWidth = width - marginX * 2;
  let currentY = height - 42;

  // 1. Header Name
  page.drawText('LORDVINCE LIWAG', {
    x: marginX,
    y: currentY - 18,
    size: 21,
    font: fontBold,
    color: darkTextColor,
  });

  // Photo box representation on top right
  const photoW = 62;
  const photoH = 74;
  const photoX = width - marginX - photoW;
  const photoY = currentY - 70;
  
  page.drawRectangle({
    x: photoX,
    y: photoY,
    width: photoW,
    height: photoH,
    color: rgb(0.92, 0.94, 0.94),
    borderColor: rgb(0.75, 0.80, 0.80),
    borderWidth: 1,
  });

  // Avatar icon inside photo box
  page.drawCircle({
    x: photoX + photoW / 2,
    y: photoY + photoH * 0.62,
    size: 14,
    color: rgb(0.65, 0.72, 0.72),
  });
  // Shoulders curve
  page.drawEllipse({
    x: photoX + photoW / 2,
    y: photoY + 14,
    xScale: 22,
    yScale: 15,
    color: rgb(0.65, 0.72, 0.72),
  });

  currentY -= 33;

  // Subtitle
  page.drawText('Virtual Assistant | AI Automation | AI-Powered Systems', {
    x: marginX,
    y: currentY,
    size: 10.5,
    font: fontBold,
    color: tealColor,
  });

  currentY -= 14;

  // Contact Info
  page.drawText('Cabanatuan City, Nueva Ecija, Philippines  |  Lordvincedliwag1@gmail.com  |  0977-621-3473', {
    x: marginX,
    y: currentY,
    size: 8.8,
    font: fontRegular,
    color: mutedTextColor,
  });

  currentY -= 20;

  // Top header rule line
  page.drawLine({
    start: { x: marginX, y: currentY },
    end: { x: width - marginX, y: currentY },
    thickness: 1.2,
    color: ruleColor,
  });

  currentY -= 16;

  // Helper for Section Headings
  function drawSectionHeading(title: string) {
    page.drawText(title, {
      x: marginX,
      y: currentY,
      size: 9.5,
      font: fontBold,
      color: tealColor,
    });
    
    // Draw rule right under the heading title across full width
    const textW = fontBold.widthOfTextAtSize(title, 9.5);
    page.drawLine({
      start: { x: marginX, y: currentY - 3 },
      end: { x: width - marginX, y: currentY - 3 },
      thickness: 0.8,
      color: tealColor,
    });

    currentY -= 14;
  }

  // Helper to wrap text
  function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  function drawParagraph(text: string, options: { font?: any; size?: number; color?: any; indent?: number; lineGap?: number }) {
    const font = options.font || fontRegular;
    const size = options.size || 8.8;
    const color = options.color || bodyTextColor;
    const indent = options.indent || 0;
    const lineGap = options.lineGap || 11.8;
    const maxWidth = contentWidth - indent;

    const lines = wrapText(text, maxWidth, font, size);
    for (const line of lines) {
      page.drawText(line, {
        x: marginX + indent,
        y: currentY,
        size,
        font,
        color,
      });
      currentY -= lineGap;
    }
  }

  // --- SECTION: PROFESSIONAL SUMMARY ---
  drawSectionHeading('PROFESSIONAL SUMMARY');
  drawParagraph(
    'Practical Virtual Assistant focused on administrative support, Google Workspace, AI-assisted workflows, and business automation. Hands-on builder of web and AI-powered projects, including a VA automation platform built with multi-client support and an AI-assisted e-commerce project in development. Brings a problem-solving mindset, strong digital tool skills, and a focus on organized, reliable workflows.',
    { lineGap: 11.5 }
  );

  currentY -= 6;

  // --- SECTION: CORE SKILLS ---
  drawSectionHeading('CORE SKILLS');
  
  const coreSkills = [
    { label: 'Virtual Assistance', text: 'Administrative support, online research, documentation, organization, digital business support' },
    { label: 'Google Workspace', text: 'Gmail, Calendar, Drive, Docs, Sheets, Workspace workflows' },
    { label: 'AI & Automation', text: 'ChatGPT, Claude, Gemini, prompt engineering, n8n, Zapier' },
    { label: 'Web & Systems', text: 'HTML, CSS, JavaScript, TypeScript, Node.js, Supabase, REST APIs' },
    { label: 'Tools & Deployment', text: 'GitHub, Render, Netlify, Canva, AI-assisted development tools' },
  ];

  for (const skill of coreSkills) {
    const labelPrefix = `${skill.label}: `;
    const labelW = fontBold.widthOfTextAtSize(labelPrefix, 8.8);
    
    page.drawText(labelPrefix, {
      x: marginX,
      y: currentY,
      size: 8.8,
      font: fontBold,
      color: darkTextColor,
    });

    const lines = wrapText(skill.text, contentWidth - labelW, fontRegular, 8.8);
    page.drawText(lines[0] || '', {
      x: marginX + labelW,
      y: currentY,
      size: 8.8,
      font: fontRegular,
      color: bodyTextColor,
    });
    currentY -= 11.5;

    for (let i = 1; i < lines.length; i++) {
      page.drawText(lines[i], {
        x: marginX + 10,
        y: currentY,
        size: 8.8,
        font: fontRegular,
        color: bodyTextColor,
      });
      currentY -= 11.5;
    }
  }

  currentY -= 6;

  // --- SECTION: SELECTED PROJECTS ---
  drawSectionHeading('SELECTED PROJECTS');

  // 1. VA Automation Hub
  page.drawText('VA Automation Hub', {
    x: marginX,
    y: currentY,
    size: 9.2,
    font: fontBold,
    color: darkTextColor,
  });
  const vaW = fontBold.widthOfTextAtSize('VA Automation Hub', 9.2);
  page.drawText(' — Deployed', {
    x: marginX + vaW,
    y: currentY,
    size: 9.2,
    font: fontOblique,
    color: mutedTextColor,
  });
  currentY -= 11.5;

  drawParagraph(
    'Built a practical VA automation platform centered on Google Workspace workflows, including Gmail, Calendar, Drive and Sheets integrations, AI-assisted work, multi-client separation, and human-in-the-loop approvals.',
    { lineGap: 11.2 }
  );

  page.drawText('Technologies: ', {
    x: marginX,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: darkTextColor,
  });
  const tech1W = fontBold.widthOfTextAtSize('Technologies: ', 8.5);
  page.drawText('Google Workspace APIs, Node.js/TypeScript, Supabase, OAuth, Render', {
    x: marginX + tech1W,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: bodyTextColor,
  });
  currentY -= 11;

  page.drawText('Live Demo: ', {
    x: marginX,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: darkTextColor,
  });
  const demo1W = fontBold.widthOfTextAtSize('Live Demo: ', 8.5);
  page.drawText('https://va-automation-hub.onrender.com', {
    x: marginX + demo1W,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: linkColor,
  });
  currentY -= 14;

  // 2. Ratecraft
  page.drawText('Ratecraft', {
    x: marginX,
    y: currentY,
    size: 9.2,
    font: fontBold,
    color: darkTextColor,
  });
  const rcW = fontBold.widthOfTextAtSize('Ratecraft', 9.2);
  page.drawText(' — Live Web Project', {
    x: marginX + rcW,
    y: currentY,
    size: 9.2,
    font: fontOblique,
    color: mutedTextColor,
  });
  currentY -= 11.5;

  drawParagraph(
    'Created a responsive lead-generation website focused on value-based pricing education for freelancers, with structured landing-page content, FAQ interaction, and email opt-in.',
    { lineGap: 11.2 }
  );

  page.drawText('Technologies: ', {
    x: marginX,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: darkTextColor,
  });
  const tech2W = fontBold.widthOfTextAtSize('Technologies: ', 8.5);
  page.drawText('HTML, CSS, JavaScript, Formspree, Netlify', {
    x: marginX + tech2W,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: bodyTextColor,
  });
  currentY -= 11;

  page.drawText('Live Demo: ', {
    x: marginX,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: darkTextColor,
  });
  const demo2W = fontBold.widthOfTextAtSize('Live Demo: ', 8.5);
  page.drawText('https://rate-craft.netlify.app/', {
    x: marginX + demo2W,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: linkColor,
  });
  currentY -= 14;

  // 3. Kanso Living — AI Dropshipping
  page.drawText('Kanso Living — AI Dropshipping / E-commerce', {
    x: marginX,
    y: currentY,
    size: 9.2,
    font: fontBold,
    color: darkTextColor,
  });
  const klW = fontBold.widthOfTextAtSize('Kanso Living — AI Dropshipping / E-commerce', 9.2);
  page.drawText(' — In Development', {
    x: marginX + klW,
    y: currentY,
    size: 9.2,
    font: fontOblique,
    color: mutedTextColor,
  });
  currentY -= 11.5;

  drawParagraph(
    'Developing an AI-assisted worldwide e-commerce concept focused on product discovery, storefront workflows, catalog operations, and automation.',
    { lineGap: 11.2 }
  );

  page.drawText('Project Type: ', {
    x: marginX,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: darkTextColor,
  });
  const ptW = fontBold.widthOfTextAtSize('Project Type: ', 8.5);
  page.drawText('Independent project', {
    x: marginX + ptW,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: bodyTextColor,
  });
  currentY -= 14;

  // 4. VA Toolkit
  page.drawText('VA Toolkit', {
    x: marginX,
    y: currentY,
    size: 9.2,
    font: fontBold,
    color: darkTextColor,
  });
  const vatW = fontBold.widthOfTextAtSize('VA Toolkit', 9.2);
  page.drawText(' — Personal Project | AI-Powered Utility', {
    x: marginX + vatW,
    y: currentY,
    size: 9.2,
    font: fontOblique,
    color: mutedTextColor,
  });
  currentY -= 11.5;

  drawParagraph(
    'Built an AI-powered drafting utility designed to support practical virtual-assistant work and content preparation.',
    { lineGap: 11.2 }
  );

  currentY -= 6;

  // --- SECTION: TRAINING & PROFESSIONAL DEVELOPMENT ---
  drawSectionHeading('TRAINING & PROFESSIONAL DEVELOPMENT');

  const trainings = [
    'RENE AI Virtual Assistant Training / Internship Program',
    'Digital Design Training (Certificate)',
    'Bookkeeping Training (Certificate)',
    'TEFL Training — 120 hours',
    'Self-taught via free YouTube-based courses in email management, calendar management, social media management, and AI',
  ];

  for (const t of trainings) {
    page.drawText('•', {
      x: marginX + 2,
      y: currentY,
      size: 9,
      font: fontBold,
      color: tealColor,
    });
    const lines = wrapText(t, contentWidth - 14, fontRegular, 8.8);
    page.drawText(lines[0] || '', {
      x: marginX + 14,
      y: currentY,
      size: 8.8,
      font: fontRegular,
      color: bodyTextColor,
    });
    currentY -= 11.2;

    for (let i = 1; i < lines.length; i++) {
      page.drawText(lines[i], {
        x: marginX + 14,
        y: currentY,
        size: 8.8,
        font: fontRegular,
        color: bodyTextColor,
      });
      currentY -= 11.2;
    }
  }

  currentY -= 6;

  // --- SECTION: ADDITIONAL VALUE ---
  drawSectionHeading('ADDITIONAL VALUE');
  drawParagraph(
    'Combines VA fundamentals with practical experience building digital systems. Comfortable learning new tools, following structured workflows, documenting processes, and improving repetitive business tasks through AI and automation.',
    { lineGap: 11.5 }
  );

  const pdfBytes = await doc.save();
  
  // Write to public and root directories
  const targetPublic = path.resolve('public/Lordvince_Liwag_Resume.pdf');
  const targetPublicAssets = path.resolve('public/assets/Lordvince_Liwag_Resume.pdf');
  const targetRoot = path.resolve('Lordvince_Liwag_Resume.pdf');
  
  fs.writeFileSync(targetPublic, pdfBytes);
  if (!fs.existsSync('public/assets')) fs.mkdirSync('public/assets', { recursive: true });
  fs.writeFileSync(targetPublicAssets, pdfBytes);
  fs.writeFileSync(targetRoot, pdfBytes);

  console.log(`Resume PDF generated successfully (${pdfBytes.length} bytes)!`);
}

generateResume().catch(err => {
  console.error('Error generating resume:', err);
  process.exit(1);
});
