import { IUser } from "./users/iuser";

export interface ILoginResponse {
    success: string;
    token: string;
    user: IUser
}
