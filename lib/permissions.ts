export type Tier = 'owner' | 'admin' | 'member';

export function deriveTierFromRoleName(name: string): Tier {
  const n = name.toLowerCase();
  if (n === 'ceo') return 'owner';
  if ([
    'cto',
    'coo',
    'cmo',
    'product manager',
    'project manager',
    'hr manager',
    'sales - account manager',
  ].includes(n)) return 'admin';
  return 'member';
}

export function canAddTeam(params: { tier: Tier; orgRoleName?: string }): boolean {
  const { tier, orgRoleName } = params;
  if (tier === 'owner' || tier === 'admin') return true;
  const n = (orgRoleName || '').toLowerCase();
  return n === 'hr manager' || n === 'project manager';
}

export function canViewBudget(tier: Tier): boolean {
  return tier === 'owner' || tier === 'admin';
}

export function canManageBudget(tier: Tier): boolean {
  return tier === 'owner' || tier === 'admin';
}
