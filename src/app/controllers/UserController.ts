import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  Post,
  Put,
  Route,
  Tags,
  Response
} from "tsoa";
import { User, UserUpdate } from "../models/User";
import { UserService } from "../services/UserService";
import { HttpError } from "../errors/HttpErros";


@Route("user")
@Tags("User")
export class UserController extends Controller {

  @Get()
  @Response<null>(404, "User not found")
  @Response<null>(500, "Internal server error")
  public async get(@Query() userId?: number): Promise<User | User[]> {
    try {
      if (userId !== undefined) {
        const user = await UserService.getById(userId);
        return user;
      }

      return await UserService.getAll();
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "UserNotFound") {
        throw new HttpError(404, `This User Id: '${userId}' does not exist`);
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }


  @Post()
  @Response<null>(400, "Invalid Input")
  public async create(@Body() body: Omit<User, "userId">): Promise<User> {
    try {
      return await UserService.create(body);
    } catch (error: any) {
      if (error.message === "PersonNotFound") {
        throw new HttpError(400, "The Person Id: '" + body.personId + "' not exist");
      }
      if (error.message === "ConflictingPerson") {
        this.setStatus(400);
        throw new HttpError(400, "This person already has a user");
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }

  @Put()
  @Response<null>(400, "Invalid Input")
  public async update(@Query() userId: number, @Body() body: Omit<UserUpdate, "userId">): Promise<User | null> {
    try {
      return UserService.update(userId, body);
    }
    catch (error: any) {
      if (error.message === "UserNotFound") {
        throw new HttpError(400, `This User Id: '${userId}' does not exist`);
      }
      if (error.message === "PersonNotFound") {
        throw new HttpError(400, "The Person Id: '" + body.personId + "' not exist");
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }

  @Delete()
  @Response<null>(400, "Invalid User Id")
  public async delete(@Query() userId: number): Promise<{ message: string; deletedUser: User }> {
    try {
      return UserService.delete(userId);
    } catch (error: any) {
      if (error.message === "UserNotFound") {
        throw new HttpError(400, `This User Id: '${userId}' does not exist`);
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }

}
