import Prism from './prism';

/**
 * Splits Prism-highlighted HTML string into safe line-by-line HTML strings.
 * Accurately tracks open/closed HTML tags so multi-line tokens (such as block comments
 * or multi-line strings) never leave open or unclosed <span> tags across lines.
 */
export function splitPrismHtmlIntoLines(html: string): string[] {
  const rawLines = html.split('\n');
  const result: string[] = [];
  const openTags: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i];

    // Prepend any tags that were left open from the previous line
    if (openTags.length > 0) {
      line = openTags.join('') + line;
    }

    // Scan for tags in this line to maintain the openTags stack
    const tagRegex = /<\/?([a-zA-Z0-9-]+)(?:\s+[^>]*)?>/g;
    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(line)) !== null) {
      const fullTag = match[0];
      const isClosing = fullTag.startsWith('</');
      if (isClosing) {
        openTags.pop();
      } else if (!fullTag.endsWith('/>')) {
        openTags.push(fullTag);
      }
    }

    // Append closing tags for any tags currently open at the end of this line
    for (let j = openTags.length - 1; j >= 0; j--) {
      const tagNameMatch = openTags[j].match(/<([a-zA-Z0-9-]+)/);
      if (tagNameMatch) {
        line += `</${tagNameMatch[1]}>`;
      }
    }

    result.push(line);
  }

  return result;
}

/**
 * Highlights source code with Prism and returns an array of line objects
 * containing line numbers and highlighted HTML content.
 */
export function highlightCodeLines(
  code: string,
  language: string = 'java'
): Array<{ lineNumber: number; html: string; rawText: string }> {
  const cleanCode = code.trim();
  const rawLines = cleanCode.split('\n');

  let highlightedHtml: string;
  try {
    const langKey = language.toLowerCase();
    const grammar = Prism.languages[langKey] || Prism.languages.java || Prism.languages.javascript;
    highlightedHtml = Prism.highlight(cleanCode, grammar, langKey);
  } catch {
    highlightedHtml = cleanCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const safeLines = splitPrismHtmlIntoLines(highlightedHtml);

  return safeLines.map((lineHtml, idx) => ({
    lineNumber: idx + 1,
    html: lineHtml || '&nbsp;',
    rawText: rawLines[idx] || ''
  }));
}
