import { IUser } from "./users/iuser";

export interface ILoginResponse {
    token: string;
    userId: number;
}
