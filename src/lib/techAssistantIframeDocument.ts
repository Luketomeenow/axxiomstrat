import { parseStrategyHtmlFragment, STRATEGY_BRIDGE_CSS } from './strategyIframeDocument'

const DM_SANS =
  'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap'

/** Portal-owned nav — hide in-iframe tab strip when embedded. */
export const TECH_ASSISTANT_EMBED_CSS = `
.tab-row { display: none !important; }
.wrap {
  max-width: 56rem !important;
  padding: 1.25rem 1rem 3rem !important;
}
.doc-hero {
  margin-bottom: 1.25rem;
  padding: 1.25rem 1.35rem;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border-tertiary);
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f5f3ff 100%);
}
.doc-hero-kicker {
  margin: 0 0 0.35rem;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #5b21b6;
}
.doc-hero-title {
  margin: 0 0 0.5rem;
  font-family: var(--font-sans);
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-text-primary);
}
.doc-hero-lead {
  margin: 0 0 0.85rem;
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  max-width: 42rem;
}
.doc-hero-pills { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.intro {
  border-left: 3px solid var(--color-text-info);
}
.layer {
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.layer:hover {
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.07);
  border-color: var(--color-border-secondary);
}
.layer-nodes {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.5rem !important;
}
.node {
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.node:hover {
  border-color: var(--color-border-info);
  transform: translateY(-1px);
}
.sb-head {
  user-select: none;
}
.sb-head::after {
  content: '';
  width: 0.45rem;
  height: 0.45rem;
  border-right: 2px solid var(--color-text-tertiary);
  border-bottom: 2px solid var(--color-text-tertiary);
  transform: rotate(45deg);
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: 0.25rem;
}
.step-block.open .sb-head::after {
  transform: rotate(-135deg);
  margin-top: 0.2rem;
}
.code-wrap {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}
.cw-body {
  scrollbar-width: thin;
  scrollbar-color: #30363d #0d1117;
}
.flow-box { line-height: 1.45; }
.phase-block { transition: box-shadow 0.2s ease; }
.phase-block:hover { box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06); }
@media (max-width: 640px) {
  .doc-hero-title { font-size: 1.15rem; }
  .fr { flex-direction: column; align-items: flex-start; }
  .fv { text-align: left; }
}
@media print {
  .tab-row { display: none !important; }
  .doc-hero { break-inside: avoid; }
  .step-block .sb-body { display: block !important; }
  .code-wrap { break-inside: avoid; max-height: none; }
  .cw-body { max-height: none; }
}
`

const TAB_BRIDGE = `
window.addEventListener('message', function (e) {
  if (!e.data || e.data.type !== 'TECH_ASSISTANT_TAB') return;
  var index = e.data.index;
  if (typeof index !== 'number') return;
  try {
    if (typeof go === 'function') go(index);
  } catch (x) {}
});
`

function escapeClosingScript(js: string): string {
  return js.replace(/<\/script/gi, '<\\/script')
}

/** Assemble iframe srcDoc for the tech assistant architecture fragment. */
export function buildTechAssistantIframeSrcDoc(raw: string): string {
  const { styles, scripts, bodyHtml } = parseStrategyHtmlFragment(raw)
  const sendPromptBridge = `
window.sendPrompt = function (text) {
  try {
    window.parent.postMessage({ type: 'STRATEGY_COPY_PROMPT', text: String(text || '') }, '*');
  } catch (e) {}
  try {
    navigator.clipboard.writeText(String(text || ''));
  } catch (e) {}
};
var _cp = typeof cp === 'function' ? cp : null;
cp = function(btn) {
  if (_cp) _cp(btn);
  try {
    var text = btn.closest('.code-wrap').querySelector('.cw-body').innerText.trim();
    window.parent.postMessage({ type: 'STRATEGY_COPY_PROMPT', text: text }, '*');
  } catch (e) {}
};
`

  const allScripts = escapeClosingScript(
    `${scripts}\n\n${sendPromptBridge}\n\n${TAB_BRIDGE}`,
  )

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${DM_SANS}" rel="stylesheet" />
<style>${STRATEGY_BRIDGE_CSS}</style>
<style>${TECH_ASSISTANT_EMBED_CSS}</style>
<style>${styles}</style>
</head>
<body class="hub-embed">
${bodyHtml}
<script>${allScripts}</script>
</body>
</html>`
}
