export type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export type User = {
    id: number;
    name: string;
    lastName: string;
    email: string;
    status: string;
    phone: string | null;
    cpf: string | null;
    birthDate: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    roles: string[];
};