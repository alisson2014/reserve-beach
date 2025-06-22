import { JSX, ReactNode, useState } from "react";
import { AuthContext } from "./useAuth";
import { User } from "./types";

export default function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};