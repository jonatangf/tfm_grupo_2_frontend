export interface ISession {
  userId: number;
  username: string;
  email: string;
  photo?: string | null;
}