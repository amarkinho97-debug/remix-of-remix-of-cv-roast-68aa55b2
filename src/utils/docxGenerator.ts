import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import type { RewrittenCV, WorkExperience, Education } from "@/types/cv";

const DARK_BLUE = "1B3A5C";
const BODY_SIZE = 24; // 12pt
const HEADING_SIZE = 28; // 14pt
const NAME_SIZE = 48; // 24pt

function sectionHeading(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: HEADING_SIZE,
        color: DARK_BLUE,
        font: "Calibri",
      }),
    ],
    spacing: { before: 400, after: 100 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: DARK_BLUE },
    },
  });
}

function bodyText(text: string, options?: { italic?: boolean; bold?: boolean }): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: BODY_SIZE,
        italics: options?.italic,
        bold: options?.bold,
        font: "Calibri",
      }),
    ],
    spacing: { after: 80 },
  });
}

function bulletPoint(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `•  ${text}`, size: BODY_SIZE, font: "Calibri" }),
    ],
    spacing: { after: 60 },
    indent: { left: 360 },
  });
}

export async function generateDocx(data: RewrittenCV): Promise<void> {
  const children: Paragraph[] = [];

  // === 1. HEADER: Name & Contact ===
  const name = data.contactInfo?.name || "Seu Nome";
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: name,
          bold: true,
          size: NAME_SIZE,
          font: "Calibri",
          color: DARK_BLUE,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    })
  );

  const contactParts = [
    data.contactInfo?.email,
    data.contactInfo?.phone,
    data.contactInfo?.city,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join("  |  "),
            size: 22,
            font: "Calibri",
            color: "555555",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );
  }

  // === 2. RESUMO PROFISSIONAL ===
  if (data.summary) {
    children.push(sectionHeading("Resumo Profissional"));
    children.push(bodyText(data.summary));
  }

  // === 3. EXPERIÊNCIA PROFISSIONAL ===
  if (data.workHistory?.length > 0) {
    children.push(sectionHeading("Experiência Profissional"));

    data.workHistory.forEach((exp: WorkExperience, idx: number) => {
      if (idx > 0) {
        children.push(new Paragraph({ spacing: { before: 200 } }));
      }

      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role, bold: true, size: 26, font: "Calibri" }),
            new TextRun({ text: `  |  ${exp.company}`, bold: true, size: 26, font: "Calibri", color: DARK_BLUE }),
          ],
          spacing: { after: 40 },
        })
      );

      children.push(bodyText(exp.period, { italic: true }));

      exp.bullets.forEach((b: string) => {
        children.push(bulletPoint(b));
      });
    });
  }

  // === 4. FORMAÇÃO ACADÊMICA ===
  if (data.education && data.education.length > 0) {
    children.push(sectionHeading("Formação Acadêmica"));

    data.education.forEach((edu: Education) => {
      const yearStr = edu.year ? ` (${edu.year})` : "";
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true, size: BODY_SIZE, font: "Calibri" }),
            new TextRun({ text: ` — ${edu.degree}${yearStr}`, size: BODY_SIZE, font: "Calibri" }),
          ],
          spacing: { after: 80 },
        })
      );
    });
  }

  // === 5. CERTIFICAÇÕES ===
  if (data.certifications && data.certifications.length > 0) {
    children.push(sectionHeading("Certificações"));

    data.certifications.forEach((cert) => {
      const yearStr = cert.year ? ` (${cert.year})` : "";
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: BODY_SIZE, font: "Calibri" }),
            new TextRun({ text: ` — ${cert.institution}${yearStr}`, size: BODY_SIZE, font: "Calibri" }),
          ],
          spacing: { after: 80 },
        })
      );
    });
  }

  // === 6. HABILIDADES E COMPETÊNCIAS ===
  if (data.skills && data.skills.length > 0) {
    children.push(sectionHeading("Habilidades e Competências"));
    children.push(bodyText(data.skills.join("  •  ")));
  }

  // Build & download
  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "CV_Blindado_CVSincero.docx");
}
