export type Role = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';

export type Roles = Role[];

export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    status: "y" | "n";
    phone: string | null;
    cpf: string | null;
    birthDate: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    roles: Roles;
};