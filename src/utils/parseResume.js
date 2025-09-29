import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import * as mammoth from "mammoth";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function parseResumeFile(file) {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (ext === "pdf") {
    const text = await readPdf(file);
    const fields = extractFields(text);
    return { text, fields };
  } else if (ext === "docx") {
    const text = await readDocx(file);
    const fields = extractFields(text);
    return { text, fields };
  } else {
    throw new Error("Unsupported file type. Please upload PDF or DOCX.");
  }
}

async function readPdf(file) {
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocument({ data }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text +=
      content.items.map((it) => ("str" in it ? it.str : "")).join("\n") + "\n";
  }
  return text;
}

async function readDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const res = await mammoth.extractRawText({ arrayBuffer });
  return res.value || "";
}

function extractFields(text) {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(\+?\d[\d\-\s()]{6,}\d)/);
  const lines = text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  // naive name guess: first non-email line with 2-4 words capitalized
  let name = "";
  for (const line of lines.slice(0, 10)) {
    if (emailMatch && line.toLowerCase().includes(emailMatch[0].toLowerCase()))
      continue;
    if (phoneMatch && line.includes(phoneMatch[0])) continue;
    const words = line.split(/\s+/);
    if (
      words.length >= 2 &&
      words.length <= 4 &&
      words.every((w) => /^[A-Z][a-zA-Z'-]+$/.test(w))
    ) {
      name = line;
      break;
    }
  }
  return {
    name: name || "",
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
  };
}
