import { PrismaClient } from "../../database/generated/prisma";
import { Loan, LoanUpdate } from "../models/Loan";
const prisma = new PrismaClient();

export class LoanService {
  static async getAll() {
    return prisma.loan.findMany();
  }

  static async getById(loanId: number) {
    const loan = await prisma.loan.findUnique({ where: { loanId } })
    if (!loan) {
      throw new Error("LoanNotFound")
    }
    return loan;
  }

  static async create(data: Loan) {
    const book = await prisma.book.findUnique({ where: { bookId: data.bookId } });
    if (!book) {
      throw new Error("BookNotFound");
    }
    const user = await prisma.user.findUnique({ where: { userId: data.userId }, include: { person: true } });
    if (!user) {
      throw new Error("UserNotFound");
    }
    if (!user.person) {
      throw new Error("UserWithoutPerson");
    }
    if (new Date(data.loanReturn) < new Date(data.loanDate)) {
      throw new Error("InvalidDateRange");
    }
    const conflictingLoan = await prisma.loan.findFirst({
      where: {
        bookId: data.bookId,
        loanReturn: {
          gt: data.loanDate,
        },
      },
    });

    if (conflictingLoan) {
      throw new Error("BookAlreadyLoaned");
    }
    return prisma.loan.create({ data });
  }

  static async update(loanId: number, data: LoanUpdate) {
    const loan = await prisma.loan.findUnique({ where: { loanId } });
    if (!loan) {
      throw new Error("LoanNotFound");
    }
    if (data.bookId) {
      const book = await prisma.book.findUnique({ where: { bookId: data.bookId } });
      if (!book) {
        throw new Error("BookNotFound");
      }
    }
    if (data.userId) {
      const user = await prisma.user.findUnique({
        where: { userId: data.userId },
        include: { person: true }
      });
      if (!user) {
        throw new Error("UserNotFound");
      }

      if (!user.person) {
        throw new Error("UserWithoutPerson");
      }
    }

    if (data.loanDate && data.loanReturn) {
      if (new Date(data.loanReturn) < new Date(data.loanDate)) {
        throw new Error("InvalidDateRange");
      }
    }

    const existingLoan = await prisma.loan.findUnique({ where: { loanId } });
    if (!existingLoan) {
      throw new Error("LoanNotFound");
    }

    if (data.loanDate || data.loanReturn) {
      const effectiveLoanDate = data.loanDate ?? existingLoan.loanDate;
      const effectiveLoanReturn = data.loanReturn ?? existingLoan.loanReturn;

      if (new Date(effectiveLoanReturn) < new Date(effectiveLoanDate)) {
        throw new Error("InvalidDateRange");
      }

      const checkBookId = data.bookId ?? existingLoan.bookId;
      const checkLoanDate = data.loanDate ?? existingLoan.loanDate;

      const conflictingLoan = await prisma.loan.findFirst({
        where: {
          bookId: checkBookId,
          loanReturn: {
            gt: checkLoanDate,
          },
          loanId: {
            not: loanId,
          },
        },
      });

      if (conflictingLoan) {
        throw new Error("BookAlreadyLoaned");
      }
    }
    return prisma.loan.update({ where: { loanId }, data: {...data} });
  }

  static async delete(loanId: number) {
    const loan = await prisma.loan.findUnique({ where: { loanId } });
    if (!loan) {
      throw new Error("LoanNotFound");
    }
    await prisma.loan.delete({ where: { loanId } });
    return {
      message: "Loan deleted successfully",
      deletedLoan: loan
    };
  }
}
