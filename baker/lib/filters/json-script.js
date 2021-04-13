const _jsonScriptMap = {
  '>': '\\u003E',
  '<': '\\u003C',
  '&': '\\u0026',
};

const escapeHtmlRegex = new RegExp(
  `[${Object.keys(_jsonScriptMap).join('')}]`,
  'g'
);

function escapeHtml(text) {
  return text.replace(escapeHtmlRegex, (m) => _jsonScriptMap[m]);
}

function jsonScriptFilter(value, elementId) {
  return `<script id="${elementId}" type="application/json">${escapeHtml(
    JSON.stringify(value)
  )}</script>`;
}

module.exports = { jsonScriptFilter };
