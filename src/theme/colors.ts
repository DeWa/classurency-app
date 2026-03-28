/** Classurency "Neon Campus" palette — see docs/brand.md */
export const colors = {
  mint: '#00F5A0',
  mintGlow: 'rgba(0, 245, 160, 0.5)',
  deepScholastic: '#1A1B2E',
  card: '#23243A',
  electricIndigo: '#6366F1',
  electricIndigoLight: '#8B5CF6',
  vendingAmber: '#FBBF24',
  paperWhite: '#F8FAFC',
  textMuted: 'rgba(248, 250, 252, 0.72)',
  textSubtle: 'rgba(248, 250, 252, 0.5)',
  border: 'rgba(255, 255, 255, 0.12)',
  glass: 'rgba(255, 255, 255, 0.08)',
  error: '#F87171',
  onIndigo: '#FFFFFF',
} as const;

export type ColorKey = keyof typeof colors;
