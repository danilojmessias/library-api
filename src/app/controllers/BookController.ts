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
import { Book, BookUpdate } from "../models/Book";
import { BookService } from "../services/BookService";
import { HttpError } from "../errors/HttpErros";

@Route("books")
@Tags("Books")
export class BookController extends Controller {

  @Get()
  @Response<null>(500, "Internal server error")
  @Response<null>(404, "Book not found")
  public async get(@Query() bookId?: number): Promise<Book | Book[]> {
    try {
      if (bookId) {
        const book = await BookService.getById(bookId);
        return book;
      } else {
        return await BookService.getAll();
      }
    } catch (error) {
      if (error instanceof Error && error.message === "BookNotFound") {
        throw new HttpError(404, `The Book Id: '${bookId}' does not exist`);
      } else {
        throw new HttpError(500, `Unexpected error: ${error}`);
      }
    }
  }

  @Post()
  @Response<null>(400, "Invalid Input")
  public async create(@Body() body: Omit<Book, "bookId">): Promise<Book> {
    try {
      return await BookService.create(body);
    } catch (error: any) {
      if (error.message === "CategoryNotFound") {
        throw new HttpError(400, `The Category Id: '${body.categoryId}' does not exist`);
      }
      throw error;
    }
  }

  @Put()
  @Response<null>(400, "Invalid Category")
  @Response<null>(400, "Invalid Book")
  public async update(@Query() bookId: number, @Body() body: Omit<BookUpdate, "bookId">): Promise<BookUpdate | null> {
    try {
      return BookService.update(bookId, body);
    }
    catch (error: any) {
      if (error.message === "BookNotFound") {
        this.setStatus(404);
        throw new HttpError(400, `The Book Id: '${bookId}' does not exist`);
      }
      if (error.message === "CategoryNotFound") {
        throw new HttpError(400, `The Category Id: '${body.categoryId}' does not exist`);
      }
      throw error;
    }
  }

  @Delete()
  @Response<null>(400, "Invalid Book")
  public async delete(@Query() bookId: number): Promise<{ message: string; deletedBook: Book }> {
    try {
      return BookService.delete(bookId);
    } catch (error: any) {
      if (error.message === "BookNotFound") {
        this.setStatus(400);
        throw new HttpError(400, `The Book Id: '${bookId}' does not exist`);
      }
      throw error;
    }
  }

}
