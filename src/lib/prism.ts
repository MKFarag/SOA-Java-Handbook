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
  'keyword': /\b(?:ABS|AND|APPLICATIONLABEL|AS|ASBITSTREAM|ATOMIC|ATTACH|BEGIN|BETWEEN|BLOB|BOOLEAN|BROKER|BROKERNAME|BY|CALL|CARDINALITY|CASE|CAST|CATALOG|CCSID|CEIL|CHARACTER|COALESCE|COMPUTE|CONSTANT|CONTINUE|COUNT|CREATE|CURRENT_DATE|CURRENT_GMTTIMESTAMP|CURRENT_TIMESTAMP|DATABASE|DATE|DECIMAL|DECLARE|DEFAULT|DELETE|DETACH|DFDL|DO|DOMAIN|ELSE|ELSEIF|ENCODING|END|ENVIRONMENT|EVAL|EVENT|EXCEPTION|EXECUTE|EXISTS|EXIT|EXTERNAL|EXTRACT|FIELD|FIELDNAME|FIELDTYPE|FIELDVALUE|FILTER|FIRSTCHILD|FLOAT|FLOOR|FOR|FORMAT|FROM|FUNCTION|GMTTIME|GMTTIMESTAMP|GROUP|HANDLER|HAVING|HTTPINPUTHEADER|HTTPRESPONSEHEADER|IDENTITY|IF|IN|INOUT|INPUTBODY|INPUTEXCEPTIONLIST|INPUTLOCALENVIRONMENT|INPUTROOT|INSERT|INT|INTEGER|INTERVAL|INTO|IS|ITEM|ITERATE|JSON|LASTCHILD|LASTMOVE|LEAVE|LEFT|LENGTH|LIKE|LIST|LOCALENVIRONMENT|LOOP|LOWER|MAX|MESSAGE|MESSAGEFLOWLABEL|MIN|MOD|MOVE|MQMD|MQRFH2|NAME|NAMESPACE|NEXTSIBLING|NODELABEL|NOT|NULL|NUMBER|OPTIONS|OR|ORDER|OUT|OUTPUTEXCEPTIONLIST|OUTPUTLOCALENVIRONMENT|OUTPUTROOT|PARENT|PARSE|PASSTHRU|PATH|POSITION|PREVIOUSSIBLING|PROCEDURE|PROPAGATE|PROPERTIES|REFERENCE|REPEAT|REPLACE|REPLICATE|RESIZE|RESIGNAL|RETURN|RETURNS|RIGHT|ROOT|ROUND|ROUTINE|ROW|SAMEFIELD|SCHEMA|SELECT|SET|SHARED|SQLCODE|SQLERRORTEXT|SQLNATIVEERROR|SQLSTATE|START|SUBSTRING|SUM|TERMINAL|THE|THEN|THROW|TIME|TIMESTAMP|TO|TRANSLATE|TRIM|TYPE|UNDO|UNION|UPDATE|UPPER|USER|UUIDASCHAR|VALUE|VALUES|WAIT|WHEN|WHERE|WHILE|XMLNSC)\b/i,
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
