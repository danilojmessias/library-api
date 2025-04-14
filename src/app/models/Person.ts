export interface Person{
    personId?: number;
    personName: string;
    email: string;
}
export interface PersonUpdate{
    personName?: string;
    email?: string;
}