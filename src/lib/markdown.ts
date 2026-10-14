function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inline(value: string) {
  const escaped = escapeHtml(value);
  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

export function renderMarkdown(source: string) {
  const lines = source.replaceAll('\r\n', '\n').split('\n');
  const html: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? '').startsWith('```')) {
        code.push(lines[index] ?? '');
        index += 1;
      }
      index += 1;
      const label = lang ? ` data-lang="${escapeHtml(lang)}"` : '';
      html.push(`<pre class="code-ex"${label}><code>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (index < lines.length && (lines[index] ?? '').startsWith('|')) {
        const cells = (lines[index] ?? '')
          .split('|')
          .slice(1, -1)
          .map((cell) => cell.trim());
        if (!cells.every((cell) => /^:?-+:?$/.test(cell))) {
          rows.push(cells);
        }
        index += 1;
      }
      if (rows.length > 0) {
        const [head, ...body] = rows;
        html.push('<div class="table-wrap"><table>');
        if (head) {
          html.push(`<thead><tr>${head.map((cell) => `<th>${inline(cell)}</th>`).join('')}</tr></thead>`);
        }
        html.push(`<tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`);
        html.push('</table></div>');
      }
      continue;
    }

    if (/^#### /.test(line)) {
      html.push(`<h4>${inline(line.slice(5))}</h4>`);
      index += 1;
      continue;
    }

    if (/^### /.test(line)) {
      html.push(`<h3>${inline(line.slice(4))}</h3>`);
      index += 1;
      continue;
    }

    if (/^## /.test(line)) {
      html.push(`<h2>${inline(line.slice(3))}</h2>`);
      index += 1;
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('• ')) {
      const items: string[] = [];
      while (index < lines.length && ((lines[index] ?? '').startsWith('- ') || (lines[index] ?? '').startsWith('• '))) {
        items.push((lines[index] ?? '').replace(/^[-•]\s/, ''));
        index += 1;
      }
      html.push(`<ul>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`);
      continue;
    }

    if (line.trim() === '') {
      index += 1;
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && (lines[index] ?? '').trim() !== '' && !/^(```|#{2,4} |\||[-•] )/.test(lines[index] ?? '')) {
      paragraph.push(lines[index] ?? '');
      index += 1;
    }
    html.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }

  return html.join('\n');
}
