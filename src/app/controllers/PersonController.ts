import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  Tags,
  Response,
  Query
} from "tsoa";
import { Person, PersonUpdate } from "../models/Person";
import { PersonService } from "../services/PersonService";
import { HttpError } from "../errors/HttpErros";


@Route("person")
@Tags("Person")
export class PersonController extends Controller {

  @Get()
  @Response<null>(404, "Person not found")
  @Response<null>(500, "Internal server error")
  public async get(@Query() personId?: number): Promise<Person | Person[]> {
    try {
      if (personId !== undefined) {
        const person = await PersonService.getById(personId);
        return person;
      }
      return await PersonService.getAll();
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "PersonNotFound") {
        this.setStatus(404);
        throw new HttpError(400, `The Person Id: '${personId}' does not exist`);
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }

  @Post()
  public async create(@Body() body: Omit<Person, "personId">): Promise<Person> {
    try {
      return await PersonService.create(body);
    }
    catch (error: any) {
      if (error.message === "EmailAlreadyExists") {
        throw new HttpError(400, `This email '${body.email}' already exists`);
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }

  }

  @Put()
  @Response<null>(400, "Invalid Person Id")
  public async update(@Query() personId: number, @Body() body: Omit<PersonUpdate, "personId">): Promise<PersonUpdate | null> {
    try {
      return await PersonService.update(personId, body);
    }
    catch (error: any) {
      if (error.message === "PersonNotFound") {
        throw new HttpError(400, `The Person Id: '${personId}' does not exist`);
      }
      if (error.message === "EmailAlreadyExists") {
        throw new HttpError(400, `This email '${body.email}' already exists`);
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }

  @Delete()
  @Response<null>(400, "Invalid Person Id")
  public async delete(@Query() personId: number): Promise<{ message: string; deletedPerson: Person }> {
    try {
      return PersonService.delete(personId);
    }
    catch (error: any) {
      if (error.message === "PersonNotFound") {
        throw new HttpError(400, `The Person Id: '${personId}' does not exist`);
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }

}
