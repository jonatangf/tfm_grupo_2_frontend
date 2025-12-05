export interface IUser {
  id: number;
  username: string;
  lastname: string;
  email: string;
  password: string;
  countries_id?: number | null;
  avatar?: string | null;
  birthdate?: Date | string | null;
  description?: string | null;
  interests?: string[] | null;
  telephone?: string | null;
  avg_rating?: number | null;
  created_at: Date | string;
  updated_at: Date | string;
}
