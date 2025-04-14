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
import { Category, CategoryUpdate } from "../models/Category";
import { CategoryService } from "../services/CategoryService";
import { HttpError } from "../errors/HttpErros";


@Route("category")
@Tags("Category")
export class CategoryController extends Controller {

  @Get()
  @Response<null>(404, "Category not found")
  @Response<null>(500, "Internal server error")
  public async get(@Query() categoryId?: number): Promise<Category | Category[]> {
    try {
      if (categoryId !== undefined) {
        const category = await CategoryService.getById(categoryId);
        return category;
      }

      return await CategoryService.getAll();
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "CategoryNotFound") {
        throw new HttpError(404, `The Category Id: '${categoryId}' does not exist`);
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }

  @Post()
  public async create(@Body() body: Omit<Category, "categoryId">): Promise<Category> {
    return CategoryService.create(body);
  }

  @Put()
  @Response<null>(400, "Invalid Category ID")
  public async update(@Query() categoryId: number, @Body() body: Omit<CategoryUpdate, "categoryId">): Promise<CategoryUpdate | null> {
    try {
      return CategoryService.update(categoryId, body);
    }
    catch (error: any) {
      if (error.message === "CategoryNotFound") {
        throw new HttpError(400, `The Category Id: '${categoryId}' does not exist`);
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }

  @Delete()
  @Response<null>(400, "Invalid Category Id")
  public async delete(@Query() categoryId: number): Promise<{ message: string; deletedCategory: Category }> {
    try {
      return CategoryService.delete(categoryId);
    } catch (error: any) {
      if (error.message === "CategoryNotFound") {
        throw new HttpError(400, `The Category Id: '${categoryId}' does not exist`);
      }
      throw new HttpError(500, `Unexpected error: ${error}`);
    }
  }

}
