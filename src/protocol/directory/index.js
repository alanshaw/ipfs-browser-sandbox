import filesize from 'filesize'
import styles from './style'

async function * buildFilesList (links) {
  for await (const link of links) {
    const row = [
      `<a href="${link.name}">${link.name}</a>`,
      filesize(link.size)
    ].map(cell => `<td class="pv1">${cell}</td>`).join('')

    yield `<tr>${row}</tr>`
  }
}

async function * buildTable (links) {
  yield `
<table class="w-100">
  <tbody>
    <tr>
      <td class="pv1">
        <a href="..">..</a>
      </td>
      <td></td>
    </tr>`
  yield * buildFilesList(links)
  yield `
  </tbody>
</table>
`
}

async function * render (path, links) {
  yield `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${path}</title>
  <style>${styles}</style>
</head>
<body class="sans-serif ma3">
  <h1 class="f5 mb3 dark-gray">Index of ${path}</h1>`
  yield * buildTable(links)
  yield `
    </div>
  </div>
</body>
</html>
`
}

exports.render = render
