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
import { Loan, LoanUpdate } from "../models/Loan";
import { LoanService } from "../services/LoanService";
import { HttpError } from "../errors/HttpErros";
import { CategoryUpdate } from "../models/Category";


@Route("loan")
@Tags("Loan")
export class LoanController extends Controller {

  @Get()
  @Response<null>(500, "Internal server error")
  @Response<null>(404, "Loan not found")
  public async get(@Query() loanId?: number): Promise<Loan | Loan[]> {
    try {
      if (loanId) {
        const loan = await LoanService.getById(loanId);
        return loan;
      } else {
        return await LoanService.getAll();
      }
    } catch (error) {
      if (error instanceof Error && error.message === "LoanNotFound") {
        throw new HttpError(404, `The Loan with Id: '${loanId}' does not exist`);
      } else {
        throw new HttpError(500, `Unexpected error: ${error}`);
      }
    }
  }

  @Post()
  @Response<null>(400, "Invalid input")
  public async create(@Body() body: Omit<Loan, "loanId">): Promise<Loan> {
    try {
      return await LoanService.create(body);
    } catch (error: any) {
      if (error.message === "BookNotFound") {
        throw new HttpError(400, `The Book with Id: '${body.bookId}' does not exist`);
      }
      if (error.message === "UserNotFound") {
        throw new HttpError(400, `The User with Id: '${body.userId}' does not exist`);
      }
      if (error.message === "UserWithoutPerson") {
        throw new HttpError(400, "User does not have an associated person");
      }
      if (error.message === "BookAlreadyLoaned") {
        throw new HttpError(400, "This book is already loaned during the selected period");
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }


  @Put()
  @Response<null>(400, "Invalid input")
  public async update(@Query() loanId: number, @Body() body: Omit<LoanUpdate, "loanId">): Promise<LoanUpdate | null> {
    try {
      return await LoanService.update(loanId, body);
    } catch (error: any) {
      if (error.message === "LoanNotFound") {
        throw new HttpError(400, `This Loan Id: '${loanId}' does not exist`);
      }
      if (error.message === "BookNotFound") {
        throw new HttpError(400, `The Book with Id: '${body.bookId}' does not exist`);
      }
      if (error.message === "UserNotFound") {
        throw new HttpError(400, `The User with Id: '${body.userId}' does not exist`);
      }
      if (error.message === "UserWithoutPerson") {
        throw new HttpError(400, "User does not have an associated person");
      }
      if (error.message === "BookAlreadyLoaned") {
        throw new HttpError(400, "This book is already loaned during the selected period");
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }


  @Delete()
  @Response<null>(400, "Invalid Loan Id")
  public async delete(@Query() loanId: number): Promise<{ message: string; deletedLoan: Loan }> {
    try {
      return LoanService.delete(loanId);
    } catch (error: any) {
      if (error.message === "LoanNotFound") {
        throw new HttpError(400, `This Loan Id: '${loanId}' does not exist`);
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }

}
