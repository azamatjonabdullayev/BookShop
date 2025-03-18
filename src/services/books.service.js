import client from "../database/db_connect.js";

class BookService {
  //? Function to get all books from PostgrSQL
  async getBooks() {
    const books = await client.query("SELECT * FROM books");
    if (books.rows.length === 0)
      throw { err_status: 404, message: "Books not found" };
    return books.rows;
  }

  //? Does exactly what getBooks do but get only one by given id
  async getBookById(id) {
    const book = await client.query("SELECT * FROM books WHERE id = $1", [id]);
    if (book.rows.length === 0)
      throw { err_status: 404, message: "Book not found" };
    return book.rows;
  }

  //? Function to add a new book
  async addBook(book) {
    if (
      !book.name ||
      !book.author ||
      !book.year ||
      !book.price ||
      !book.quantity
    )
      throw { err_status: 400, message: "Required field of book is needed!" };

    const existingBook = await client.query(
      "SELECT * FROM books WHERE name = $1",
      [book.name]
    );
    if (existingBook.rows.length) {
      throw { err_status: 400, message: "Book already exists!" };
    }

    const newBook = await client.query(
      "INSERT INTO books (name, author, year, price, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [book.name, book.author, book.year, book.price, book.quantity]
    );
    return { message: "Book was successfully added!", book: newBook.rows[0] };
  }

  async updateBook(id, book) {
    if (
      !id ||
      !book.name ||
      !book.author ||
      !book.year ||
      !book.price ||
      !book.quantity
    ) {
      throw { err_status: 400, message: "Required field of book is needed!" };
    }

    const updatedBook = await client.query(
      "UPDATE books SET name = $1, author = $2, year = $3, price = $4, quantity = $5 WHERE id = $6 RETURNING *"
    );
    return {
      message: "Book was successfully updated!",
      book: updatedBook.rows,
    };
  }
}

export default BookService;
