import { PrismaClient } from "../../database/generated/prisma";
import { Book, BookUpdate } from "../models/Book";
const prisma = new PrismaClient();

export class BookService {
  static async getAll() {
    return prisma.book.findMany();
  }

  static async getById(bookId: number) {
    const book = await prisma.book.findUnique({ where: { bookId } })
    if (!book) {
      throw new Error("BookNotFound")
    }
    return book;
  }

  static async create(data: Book) {
    const category = await prisma.category.findUnique({ where: { categoryId: data.categoryId } });
    if (!category) {
      throw new Error("CategoryNotFound");
    }
    return prisma.book.create({ data });
  }

  static async update(bookId: number, data: BookUpdate) {
    const book = await prisma.book.findUnique({ where: { bookId } });
    if (!book) {
      throw new Error("BookNotFound");
    }
    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { categoryId: data.categoryId } });
      if (!category) {
        throw new Error("CategoryNotFound");
      }
    }

    return prisma.book.update({ where: { bookId }, data: { ...data } });
  }

  static async delete(bookId: number) {
    const book = await prisma.book.findUnique({ where: { bookId } });
    if (!book) {
      throw new Error("BookNotFound");
    }
    await prisma.book.delete({ where: { bookId } });
    return {
      message: "Book deleted successfully",
      deletedBook: book
    };
  }
}
