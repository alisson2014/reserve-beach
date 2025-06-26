import { User } from "../../types/user";

export interface ILoginResponse {
    user: User;
    message: string;
    status: boolean;
};