/** Shared hub gate password check (matches HubPasswordGate). */

export function getExpectedHubPassword(): string | undefined {
  const p = import.meta.env.VITE_HUB_PASSWORD
  return typeof p === 'string' && p.length > 0 ? p : undefined
}

export function isHubPasswordConfigured(): boolean {
  return getExpectedHubPassword() !== undefined
}

export function verifyHubPassword(password: string): boolean {
  const expected = getExpectedHubPassword()
  if (!expected) return true
  return password === expected
}
