import { IUser } from "./iuser";

export interface ILoginResponse {
    success: string;
    token: string;
    user: IUser
}
