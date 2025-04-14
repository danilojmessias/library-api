export interface Loan{
    loanId?: number;
    loanDate: Date;
    loanReturn: Date;
    userId: number;
    bookId: number;
}
export interface LoanUpdate{
    loanDate?: Date;
    loanReturn?: Date;
    userId?: number;
    bookId?: number;
}