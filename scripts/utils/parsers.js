export function parsePoem(text) {
  const lines = text.split(/\r?\n/);
  let stanzaList = [];
  let thisStanza = [];
  lines.forEach((l) => {
    if (l.trim().length == 0) {
      stanzaList.push(thisStanza);
      thisStanza = [];
    } else {
      thisStanza.push({
        text: parseText(l),
        class: parseClass(l),
      });
    }
  });
  return stanzaList;
}

export function parseClass(text) {
  if (text.startsWith('# ')) {
    return 'title';
  } else {
    return 'line';
  }
}

export function parseText(text) {
  return text.replace('# ', '').replace(' ', '&nbsp;');
}
