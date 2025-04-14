export interface Book {
  bookId?: number;
  title: string;
  author: string;
  categoryId: number;
}
export interface BookUpdate {
  title?: string;
  author?: string;
  categoryId?: number;
}
