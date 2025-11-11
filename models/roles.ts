// Centralized role definitions and hierarchy

export type Role =
  // Executive
  | 'CEO'
  | 'CTO'
  | 'COO'
  | 'CMO'
  // Departments
  | 'HR Manager'
  | 'Recruiter'
  | 'Office Admin'
  | 'Marketing - Digital Marketer'
  | 'Marketing - SEO Specialist'
  | 'Marketing - Social Media Manager'
  | 'Sales - Sales Executive'
  | 'Sales - Account Manager'
  | 'Sales - Business Analyst'
  // Engineering Division
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'UI/UX Designer'
  | 'Mobile Developer'
  | 'Game Developer'
  | 'API Developer'
  | 'Database Administrator (DBA)'
  | 'Data Engineer'
  | 'AI/ML Engineer'
  | 'DevOps Engineer'
  | 'Cloud Engineer'
  | 'System Administrator'
  | 'Site Reliability Engineer (SRE)'
  | 'QA Tester'
  | 'QA Automation Engineer'
  | 'Performance Tester'
  | 'Security Tester'
  | 'Ethical Hacker'
  // Product & Design
  | 'Product Manager'
  | 'Graphic Designer'
  | 'Web Designer'
  // Data & AI
  | 'Data Scientist'
  | 'Data Analyst'
  | 'AI Engineer'
  // IT Support & Maintenance
  | 'IT Helpdesk'
  | 'Technical Support Engineer'
  | 'Network Engineer';

export const ROLE_HIERARCHY: Record<string, Role[]> = {
  CEO: ['CTO', 'COO', 'CMO'],
  CTO: [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'Mobile Developer',
    'Game Developer',
    'API Developer',
    'Database Administrator (DBA)',
    'Data Engineer',
    'AI/ML Engineer',
    'DevOps Engineer',
    'Cloud Engineer',
    'System Administrator',
    'Site Reliability Engineer (SRE)',
    'QA Tester',
    'QA Automation Engineer',
    'Performance Tester',
    'Security Tester',
    'Ethical Hacker',
    'Product Manager',
    'Graphic Designer',
    'Web Designer',
    'Data Scientist',
    'Data Analyst',
    'AI Engineer',
  ],
  COO: ['HR Manager', 'Recruiter', 'Office Admin'],
  CMO: [
    'Marketing - Digital Marketer',
    'Marketing - SEO Specialist',
    'Marketing - Social Media Manager',
    'Sales - Sales Executive',
    'Sales - Account Manager',
    'Sales - Business Analyst',
  ],
};

// Optional: department groupings for convenience
export const DEPARTMENTS: Record<string, Role[]> = {
  Marketing: [
    'Marketing - Digital Marketer',
    'Marketing - SEO Specialist',
    'Marketing - Social Media Manager',
  ],
  Sales: ['Sales - Sales Executive', 'Sales - Account Manager', 'Sales - Business Analyst'],
  HR: ['HR Manager', 'Recruiter', 'Office Admin'],
  Engineering: [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'Mobile Developer',
    'Game Developer',
    'API Developer',
    'Database Administrator (DBA)',
    'Data Engineer',
    'AI/ML Engineer',
    'DevOps Engineer',
    'Cloud Engineer',
    'System Administrator',
    'Site Reliability Engineer (SRE)',
    'QA Tester',
    'QA Automation Engineer',
    'Performance Tester',
    'Security Tester',
    'Ethical Hacker',
  ],
  ProductDesign: ['Product Manager', 'UI/UX Designer', 'Graphic Designer', 'Web Designer'],
  DataAI: ['Data Scientist', 'Data Analyst', 'AI Engineer', 'AI/ML Engineer', 'Data Engineer'],
  ITSupport: ['IT Helpdesk', 'Technical Support Engineer', 'Network Engineer', 'Database Administrator (DBA)'],
};

export function isRole(value: string): value is Role {
  return (
    Object.keys(ROLE_HIERARCHY).includes(value) ||
    Object.values(ROLE_HIERARCHY).flat().includes(value as Role) ||
    Object.values(DEPARTMENTS).flat().includes(value as Role)
  );
}

export function getChildren(role: keyof typeof ROLE_HIERARCHY): Role[] {
  return ROLE_HIERARCHY[role] ?? [];
}

export function getParents(role: Role): string[] {
  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, children]) => children.includes(role))
    .map(([parent]) => parent);
}
