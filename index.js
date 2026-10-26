import { appendFileSync } from 'node:fs';

try {
  const rawPayload = process.env.INPUT_PAYLOAD;
  const outputPath = process.env.GITHUB_OUTPUT;

  if (typeof rawPayload !== 'string') throw new Error('Invalid input');
  if (typeof outputPath !== 'string' || outputPath.length === 0) throw new Error('Invalid output');

  let parsed;
  try {
    parsed = JSON.parse(rawPayload);
  } catch {
    throw new Error('Invalid input');
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid input');

  const text = parsed.text;
  const version = parsed.version;

  if (typeof text !== 'string') throw new Error('Invalid input');
  if (typeof version !== 'string') throw new Error('Invalid input');
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('Invalid input');

  const heading = `## ${version}`;
  const lines = text.split(/\r?\n/);
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === heading) {
      found = true;
      break;
    }
  }

  const result = JSON.stringify({ found, heading });
  appendFileSync(outputPath, `result=${result}\n`);
} catch (err) {
  throw err;
}