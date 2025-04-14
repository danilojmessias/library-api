export interface User{
    userId?: number;
    personId: number;
    password: string;
}

export interface UserUpdate{
    personId?: number;
    password?: string;
}