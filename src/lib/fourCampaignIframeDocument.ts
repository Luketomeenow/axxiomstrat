import { buildFullDocumentIframeSrcDoc } from './fullDocumentIframeSrcDoc'

/** Parent shell drives campaign + inner tabs via postMessage. */
const CAMP_BRIDGE = `
window.addEventListener('message', function (e) {
  if (!e.data) return;
  if (e.data.type === '4CAMP_CAMP' && typeof e.data.n === 'number' && typeof showCamp === 'function') {
    showCamp(e.data.n);
  }
  if (
    e.data.type === '4CAMP_INNER' &&
    typeof e.data.camp === 'string' &&
    typeof e.data.num === 'number' &&
    typeof showInner === 'function'
  ) {
    showInner(e.data.camp, e.data.num, 's');
  }
});
`

export function buildFourCampaignIframeSrcDoc(raw: string): string {
  return buildFullDocumentIframeSrcDoc(raw, CAMP_BRIDGE)
}
