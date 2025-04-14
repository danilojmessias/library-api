import { PrismaClient } from "../../database/generated/prisma";
import { Category, CategoryUpdate } from "../models/Category";
const prisma = new PrismaClient();

export class CategoryService {
  static async getAll() {
    return prisma.category.findMany();
  }

  static async getById(categoryId: number) {
    const category = await prisma.category.findUnique({ where: { categoryId } })
    if (!category) {
      throw new Error("CategoryNotFound")
    }
    return category;
  }

  static async create(data: Category) {
    return prisma.category.create({ data });
  }

  static async update(categoryId: number, data: CategoryUpdate) {
    const category = await prisma.category.findUnique({ where: { categoryId } })
    if (!category) {
      throw new Error("CategoryNotFound")
    }
    return prisma.category.update({ where: { categoryId }, data:{...data} });
  }

  static async delete(categoryId: number) {
    const category = await prisma.category.findUnique({ where: { categoryId } })
    if (!category) {
      throw new Error("CategoryNotFound")
    }
    await prisma.category.delete({ where: { categoryId } });
    return {
      message: "Category deleted successfully",
      deletedCategory: category
    };
  }
}
