import { PrismaClient } from "../../database/generated/prisma";
import { User, UserUpdate } from "../models/User";
const prisma = new PrismaClient();

export class UserService {
  static async getAll() {
    return prisma.user.findMany();
  }

  static async getById(userId: number) {
    const user = await prisma.user.findUnique({ where: { userId } })
    if (!user) {
      throw new Error("UserNotFound")
    }
    return user;
  }

  static async create(data: User) {
    const person = await prisma.person.findUnique({ where: { personId: data.personId } });
    if (!person) {
      throw new Error("PersonNotFound");
    }
    const conflictingPerson = await prisma.user.findFirst({
      where: {
        personId: data.personId,
      },
    });
    if (conflictingPerson) {
      throw new Error("ConflictingPerson");
    }
    return prisma.user.create({ data });
  }

  static async update(userId: number, data: UserUpdate) {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      throw new Error("UserNotFound");
    }
    if (data.personId) {
      const person = await prisma.person.findUnique({ where: { personId: data.personId } });
      if (!person) {
        throw new Error("PersonNotFound");
      }
    }

    return prisma.user.update({ where: { userId }, data:{...data} });
  }

  static async delete(userId: number) {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      throw new Error("UserNotFound");
    }
    await prisma.user.delete({ where: { userId } });
    return {
      message: "User deleted successfully",
      deletedUser: user
    };
  }
}
