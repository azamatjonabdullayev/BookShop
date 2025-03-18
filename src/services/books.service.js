import client from "../database/db_connect.js";

class BookService {
  async getBooks() {
    const books = await client.query("SELECT * FROM books");
    if (books.rows.length === 0)
      throw { err_status: 404, message: "Books not found" };
    return books.rows;
  }

  async getBookById(id) {
    const book = await client.query("SELECT * FROM books WHERE id = $1", [id]);
    if (book.rows.length === 0)
      throw { err_status: 404, message: "Book not found" };
    return book.rows;
  }

  async addBook(book) {
    if (
      !book.name ||
      !book.author ||
      !book.year ||
      !book.price ||
      !book.quantity
    )
      throw { err_status: 400, message: "Required field of book is needed!" };

    const newBook = await client.query(
      "INSERT INTO books (name, author, year, price, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [book.name, book.author, book.year, book.price, book.quantity]
    );
    return { message: "Book was successfully added!", book: newBook.rows[0] };
  }
}
