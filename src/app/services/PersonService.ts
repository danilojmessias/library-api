import { PrismaClient } from "../../database/generated/prisma";
import { Person, PersonUpdate } from "../models/Person";
const prisma = new PrismaClient();

export class PersonService {
  static async getAll() {
    return prisma.person.findMany();
  }

  static async getById(personId: number) {
    const person = await prisma.person.findUnique({ where: { personId } })
    if (!person) {
      throw new Error("PersonNotFound")
    }
    return person;
  }

  static async create(data: Person) {
    const conflictingEmail = await prisma.person.findFirst({
      where: {
        email: data.email,
      },
    });
    if (conflictingEmail) {
      throw new Error("EmailAlreadyExists");
    }
    return prisma.person.create({ data });
  }

  static async update(personId: number, data: PersonUpdate) {
    const person = await prisma.person.findUnique({ where: { personId } })
    if (!person) {
      throw new Error("PersonNotFound")
    }
    if (data.email) {
      const conflictingEmail = await prisma.person.findFirst({
        where: {
          email: data.email,
          NOT: {
            personId: personId ?? 0,
          },
        },
      });
    
      if (conflictingEmail) {
        throw new Error("EmailAlreadyExists");
      }
    }
    
    return prisma.person.update({ where: { personId }, data: {...data} });
  }

  static async delete(personId: number) {
    const person = await prisma.person.findUnique({ where: { personId } })
    if (!person) {
      throw new Error("PersonNotFound")
    }
    await prisma.person.delete({ where: { personId } });
    return {
      message: "Person deleted successfully",
      deletedPerson: person
    };
  }
}
