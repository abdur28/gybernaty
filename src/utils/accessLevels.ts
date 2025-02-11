// utils/accessLevels.ts
export const ACCESS_LEVELS = {
  PERSONAL: { min: 1_000_000_000, level: 'personal' },  // 1B
  A: { min: 10_000_000_000, level: 'A' },              // 10B
  B: { min: 100_000_000_000, level: 'B' },             // 100B
  C: { min: 1_000_000_000_000, level: 'C' },           // 1T
  D: { min: 10_000_000_000_000, level: 'D' }           // 10T
} as const;

export function getAccessLevel(balance: number) {
  if (balance >= ACCESS_LEVELS.D.min) return ACCESS_LEVELS.D.level;
  if (balance >= ACCESS_LEVELS.C.min) return ACCESS_LEVELS.C.level;
  if (balance >= ACCESS_LEVELS.B.min) return ACCESS_LEVELS.B.level;
  if (balance >= ACCESS_LEVELS.A.min) return ACCESS_LEVELS.A.level;
  if (balance >= ACCESS_LEVELS.PERSONAL.min) return ACCESS_LEVELS.PERSONAL.level;
  return null;
}