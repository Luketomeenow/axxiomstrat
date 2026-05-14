/** CSS variables + tweaks so legacy strategy HTML reads clearly inside an iframe. */
export const STRATEGY_BRIDGE_CSS = `
:root {
  --font-sans: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, "Cascadia Code", "Source Code Pro", monospace;
  --color-background-primary: #ffffff;
  --color-background-secondary: #f1f5f9;
  --color-background-info: #dbeafe;
  --color-background-success: #dcfce7;
  --color-background-warning: #fef3c7;
  --color-background-danger: #fee2e2;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #64748b;
  --color-text-info: #1d4ed8;
  --color-text-success: #15803d;
  --color-text-warning: #b45309;
  --color-text-danger: #b91c1c;
  --color-border-tertiary: #e2e8f0;
  --color-border-secondary: #cbd5e1;
  --color-border-info: #93c5fd;
  --color-border-success: #86efac;
  --color-border-warning: #fcd34d;
  --color-border-danger: #fca5a5;
  --border-radius-md: 10px;
  --border-radius-lg: 14px;
}
body {
  margin: 0;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.55;
}
.wrap {
  padding: 1.5rem 0.75rem 2.5rem !important;
  max-width: 52rem;
  margin: 0 auto;
}
button {
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.3;
  border-radius: 9999px;
  padding: 0.4rem 0.85rem;
  border: 1px solid var(--color-border-tertiary);
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  transition: background 0.15s, border-color 0.15s;
}
button:hover {
  background: #e2e8f0;
  border-color: var(--color-border-secondary);
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.title, .ttl, .panel-title, .section-title, .day-title {
  font-size: 1.2rem !important;
  line-height: 1.35 !important;
}
.sub, .panel-sub, .section-sub, .day-theme {
  font-size: 0.9375rem !important;
}
.tab.active, .step-pill.active, .day-pill.active {
  background: var(--color-background-info) !important;
  color: var(--color-text-info) !important;
  border-color: transparent !important;
}
`;

const TABLER_ICONS_CSS =
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.34.0/dist/tabler-icons.min.css';
const DM_SANS =
  'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap';

export function parseStrategyHtmlFragment(raw: string): {
  styles: string;
  scripts: string;
  bodyHtml: string;
} {
  const styles: string[] = [];
  let rest = raw.trim();
  rest = rest.replace(/<style>([\s\S]*?)<\/style>/gi, (_, css: string) => {
    styles.push(css.trim());
    return '';
  });
  const scripts: string[] = [];
  rest = rest.replace(/<script>([\s\S]*?)<\/script>/gi, (_, js: string) => {
    scripts.push(js.trim());
    return '';
  });
  return {
    styles: styles.join('\n\n'),
    scripts: scripts.join('\n\n'),
    bodyHtml: rest.trim(),
  };
}

export function buildStrategyIframeSrcDoc(raw: string): string {
  const { styles, scripts, bodyHtml } = parseStrategyHtmlFragment(raw);
  const sendPromptBridge = `
window.sendPrompt = function (text) {
  try {
    window.parent.postMessage({ type: 'STRATEGY_COPY_PROMPT', text: String(text || '') }, '*');
  } catch (e) {}
  try {
    navigator.clipboard.writeText(String(text || ''));
  } catch (e) {}
};
`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${DM_SANS}" rel="stylesheet" />
<link rel="stylesheet" href="${TABLER_ICONS_CSS}" />
<style>${STRATEGY_BRIDGE_CSS}</style>
<style>${styles}</style>
</head>
<body>
${bodyHtml}
<script>
${scripts}
${sendPromptBridge}
</script>
</body>
</html>`;
}
