const {
  getAllBooks,
  addBook,
  getBookById,
  editBook,
  deleteBook,
} = require("../controllers/bookshelf.controllers");

module.exports = {
  getAllBooks: {
    method: "GET",
    path: "/books",
    handler: getAllBooks,
  },
  getBookById: {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookById,
  },
  addBook: {
    method: "POST",
    path: "/books",
    handler: addBook,
  },
  editBook: {
    method: "PUT",
    path: "/books/{bookId}",
    handler: editBook,
  },
  deleteBook: {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBook,
  },
};
