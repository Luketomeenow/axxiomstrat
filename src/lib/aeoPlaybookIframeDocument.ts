import { buildFullDocumentIframeSrcDoc } from './fullDocumentIframeSrcDoc'

const TAB_BRIDGE = `
window.addEventListener('message', function (e) {
  if (!e.data || e.data.type !== 'AEO_TAB' || typeof e.data.id !== 'string') return;
  try {
    var id = e.data.id;
    var btn = document.querySelector('.nav-btn[data-aeo-tab="' + id + '"]');
    if (btn && typeof showTab === 'function') showTab(id, btn);
  } catch (x) {}
});
`

/** Assemble iframe srcDoc from the standalone AEO playbook HTML file. */
export function buildAeoPlaybookIframeSrcDoc(raw: string): string {
  return buildFullDocumentIframeSrcDoc(raw, TAB_BRIDGE)
}
