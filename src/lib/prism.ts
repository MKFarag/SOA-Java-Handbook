import Prism from 'prismjs';

// Ensure Prism is globally available before language definitions execute
if (typeof window !== 'undefined') {
  (window as unknown as { Prism: typeof Prism }).Prism = Prism;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;
}

// Language definitions used across handbook topics
import 'prismjs/components/prism-markup'; // covers xml, html
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-properties';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';

// Custom ESQL definition for IBM App Connect Enterprise (ACE)
Prism.languages.esql = {
  'comment': [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
      greedy: true
    },
    {
      pattern: /(^|[^\\:])--.*/,
      lookbehind: true,
      greedy: true
    }
  ],
  'string': {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'keyword': /\b(?:AND|AS|ATTACH|BETWEEN|BLOB|BOOLEAN|BROKER|BY|CALL|CASE|CAST|CHARACTER|COMPUTE|CONSTANT|CREATE|DATABASE|DATE|DECIMAL|DECLARE|DELETE|DETACH|DO|ELSE|ELSEIF|END|ENVIRONMENT|EVAL|EVENT|EXCEPTION|EXECUTE|EXIT|EXTERNAL|EXTRACT|FIELD|FIELDNAME|FIELDVALUE|FILTER|FIRSTCHILD|FLOAT|FOR|FROM|FUNCTION|GMTTIME|GMTTIMESTAMP|GROUP|HAVING|IF|IN|INOUT|INSERT|INT|INTEGER|INTERVAL|INTO|IS|ITERATE|LASTCHILD|LEAVE|LIKE|LIST|LOCALENVIRONMENT|LOOP|MESSAGE|MOD|MOVE|NAMESPACE|NEXTSIBLING|NOT|NULL|OR|ORDER|OUT|OUTPUTEXCEPTIONLIST|OUTPUTLOCALENVIRONMENT|OUTPUTROOT|PASSTHRU|PREVIOUSSIBLING|PROCEDURE|PROPAGATE|PROPERTIES|REFERENCE|REPEAT|RESIZE|RESIGNAL|RETURN|RETURNS|ROUTINE|SCHEMA|SELECT|SET|SHARED|SQLCODE|SQLERRORTEXT|SQLNATIVEERROR|SQLSTATE|START|TERMINAL|THE|THEN|THROW|TIME|TIMESTAMP|TO|TYPE|UNDO|UNION|UPDATE|USER|VALUES|WAIT|WHEN|WHERE|WHILE)\b/i,
  'boolean': /\b(?:TRUE|FALSE|UNKNOWN)\b/i,
  'number': /\b0x[\da-f]+\b|\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  'operator': /:=|<>|!=|<=|>=|\|\||[=+*/%<>-]/,
  'punctuation': /[()[\]{},;.:]/
};

// Aliases for Command / CLI scripts
Prism.languages.command = Prism.languages.bash;
Prism.languages.cmd = Prism.languages.bash;
Prism.languages.cli = Prism.languages.bash;

export default Prism;
