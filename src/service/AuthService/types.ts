export interface IUser {
    id: number;
    name: string;
    email: string;
};

export interface ILoginResponse {
    user: IUser;
    message: string;
};