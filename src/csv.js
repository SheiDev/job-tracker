export function escapeCsvCell(value) {
  const text = String(value ?? '')
  const spreadsheetSafeText = /^[\t\r ]*[=+\-@]/.test(text)
    ? `'${text}`
    : text

  return `"${spreadsheetSafeText.replaceAll('"', '""')}"`
}

export function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  const input = text.replace(/^\uFEFF/, '')

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]

    if (quoted && character === '"' && input[index + 1] === '"') {
      cell += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(cell)
      cell = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && input[index + 1] === '\n') index += 1
      row.push(cell)
      if (row.some((value) => value !== '')) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += character
    }
  }

  if (quoted) throw new Error('Unclosed CSV quote')
  if (cell || row.length) {
    row.push(cell)
    if (row.some((value) => value !== '')) rows.push(row)
  }
  return rows
}

export function restoreCsvValue(value) {
  return value.replace(/^'(?=[=+\-@])/, '')
}
