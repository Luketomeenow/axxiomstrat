/**
 * Assemble a full iframe srcDoc from standalone HTML: head links, styles,
 * body markup (non-script children), then inline user scripts + optional bridge.
 */
function escapeClosingScript(js: string): string {
  return js.replace(/<\/script/gi, '<\\/script')
}

export function buildFullDocumentIframeSrcDoc(
  raw: string,
  bridgeScript: string,
): string {
  const parsed = new DOMParser().parseFromString(raw, 'text/html')
  if (!parsed.body) {
    throw new Error('Could not parse HTML document')
  }

  const headMeta = parsed.head.querySelector('meta[charset]')?.outerHTML ?? ''
  const headViewport =
    parsed.head.querySelector('meta[name="viewport"]')?.outerHTML ??
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />'

  const links = Array.from(
    parsed.head.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"]'),
  )
    .map((el) => el.outerHTML)
    .join('\n')

  const styleBlocks = Array.from(parsed.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n\n')

  const scriptPieces: string[] = []
  const bodyParts: string[] = []
  for (const el of Array.from(parsed.body.children)) {
    if (el.tagName === 'SCRIPT') {
      const t = (el as HTMLScriptElement).textContent ?? ''
      if (t.trim()) scriptPieces.push(t)
    } else {
      bodyParts.push(el.outerHTML)
    }
  }
  const userScripts = scriptPieces.join('\n\n')
  const bridge = bridgeScript.trim()
  const allScripts = escapeClosingScript(
    bridge ? `${userScripts}\n\n${bridge}` : userScripts,
  )

  const bodyHtml = bodyParts.join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
${headMeta}
${headViewport}
${links}
<style>${styleBlocks}</style>
</head>
<body>
${bodyHtml}
<script>${allScripts}</script>
</body>
</html>`
}
