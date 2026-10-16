const phraseHeadings = new Set(['Фраза на автомате', 'Phrase you can say', 'Phrase to recite']);
const shortHeadings = new Set(['Короткий ответ', 'Short answer']);

export type StorySections = {
  phrase: string;
  short: string;
};

function flushSection(
  role: 'phrase' | 'short' | null,
  buffer: string[],
  sections: StorySections,
) {
  if (!role) return;
  const text = buffer.join('\n').trim();
  if (!text) return;
  if (role === 'phrase' && !sections.phrase) sections.phrase = text;
  if (role === 'short' && !sections.short) sections.short = text;
}

export function splitStorySections(body: string): StorySections {
  const sections: StorySections = { phrase: '', short: '' };
  const lines = body.replaceAll('\r\n', '\n').split('\n');
  let role: 'phrase' | 'short' | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    if (!line.startsWith('#### ')) {
      if (role) buffer.push(line);
      continue;
    }
    flushSection(role, buffer, sections);
    buffer = [];
    const title = line.slice(5).trim();
    if (phraseHeadings.has(title)) role = 'phrase';
    else if (shortHeadings.has(title)) role = 'short';
    else role = null;
  }

  flushSection(role, buffer, sections);
  return sections;
}
