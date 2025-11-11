export type User = {
    id: number;
    name: string;
    email: string;
    role: import('./roles').Role;
    phone?: string;
    address?: string;
    firm?: string;
    position?: string;
    specialty?: string;
    bar_number?: string;
    years_experience?: number;
    education?: string;
    bio?: string;
    created_at?: Date;
    updated_at?: Date;
  };

export type UserProfile = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    firm: string;
    position: string;
    specialty: string;
    barNumber: string;
    yearsExperience: number;
    education: string;
    bio: string;
  };

export type ProfileStats = {
    activeCases: number;
    completedCases: number;
    successRate: string;
    hoursBilled: number;
  };