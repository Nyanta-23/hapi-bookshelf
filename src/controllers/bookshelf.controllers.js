const { nanoid } = require("nanoid");
const books = require("../models/books");

function isFinished(readPage, pageCount) {
  if (readPage !== pageCount || readPage < pageCount) return false;
  return true;
}

module.exports = {
  getAllBooks: (req, h) => {
    try {
      const { name, reading, finished } = req.query;

      if (name) {
        const searchName = name.toLowerCase();
        const searchBookByName = books.filter((search) =>
          search.name.toLowerCase().includes(searchName)
        );

        return h
          .response({
            status: "success",
            data: {
              books: searchBookByName,
            },
          })
          .code(200);
      } else if (reading == 0 || reading == 1) {
        const convertToBool = reading != 1 ? false : true;
        const getBookByReading = books.filter(
          (item) => item.reading == convertToBool
        );

        return h
          .response({
            status: "success",
            data: {
              books: getBookByReading,
            },
          })
          .code(200);
      } else if (finished == 0 || finished == 1) {
        const convertToBool = finished != 1 ? false : true;
        const getBookByFinished = books.filter(
          (item) => item.finished == convertToBool
        );

        return h
          .response({
            status: "success",
            data: {
              books: getBookByFinished,
            },
          })
          .code(200);
      } else {
        const getAllBooks = books.map((item) => {
          return {
            id: item.id,
            name: item.name,
            publisher: item.publisher,
          };
        });

        return h
          .response({
            status: "success",
            data: {
              books: getAllBooks,
            },
          })
          .code(200);
      }
    } catch (error) {
      console.error(`Error ${error}`);
      return h
        .response({
          message: `Error ${error}`,
        })
        .code(500);
    }
  },

  getBookById: (req, h) => {
    try {
      const { bookId } = req.params;

      const findBook = books.find((item) => item.id === bookId);

      if (findBook != undefined) {
        return h
          .response({
            status: "success",
            data: {
              book: findBook,
            },
          })
          .code(200);
      }
      return h
        .response({
          status: "fail",
          message: "Buku tidak ditemukan",
        })
        .code(404);
    } catch (error) {
      console.error(`Error ${error}`);
      return h
        .response({
          message: `Error ${error}`,
        })
        .code(500);
    }
  },

  addBook: (req, h) => {
    try {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = req.payload;

      const add_data = {
        id: nanoid(16),
        name,
        year: parseInt(year),
        author,
        summary,
        publisher,
        pageCount: parseInt(pageCount),
        readPage: parseInt(readPage),
        finished: isFinished(readPage, pageCount),
        reading: Boolean(reading),
        insertedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (name === undefined || name.length === 0) {
        return h
          .response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
          })
          .code(400);
      } else if (readPage > pageCount) {
        return h
          .response({
            status: "fail",
            message:
              "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
          })
          .code(400);
      } else {
        books.push(add_data);
        return h
          .response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
              bookId: add_data.id,
            },
          })
          .code(201);
      }
    } catch (error) {
      console.error(`Error ${error}`);
      return h
        .response({
          message: `Error: ${error.message}`,
        })
        .code(500);
    }
  },

  editBook: (req, h) => {
    try {
      const { bookId } = req.params;
      const findBook = books.find((item) => item.id === bookId);
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = req.payload;

      if (findBook != undefined) {
        if (name === undefined || name.length == 0) {
          return h
            .response({
              status: "fail",
              message: "Gagal memperbarui buku. Mohon isi nama buku",
            })
            .code(400);
        } else if (readPage > pageCount) {
          return h
            .response({
              status: "fail",
              message:
                "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
            })
            .code(400);
        } else {
          const edit_data = {
            id: findBook.id,
            name,
            year: parseInt(year),
            author,
            summary,
            publisher,
            pageCount: parseInt(pageCount),
            readPage: parseInt(readPage),
            finished: isFinished(readPage, pageCount),
            reading: Boolean(reading),
            insertedAt: findBook.insertedAt,
            updatedAt: new Date().toISOString(),
          };

          books.forEach((element, index) => {
            if (element.id == bookId) {
              books[index] = edit_data;
            }
          });

          return h
            .response({
              status: "success",
              message: "Buku berhasil diperbarui",
            })
            .code(200);
        }
      } else {
        return h
          .response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
          })
          .code(404);
      }
    } catch (error) {
      console.error(`Error ${error}`);
      return h
        .response({
          message: `Error: ${error.message}`,
        })
        .code(500);
    }
  },

  deleteBook: (req, h) => {
    try {
      const { bookId } = req.params;
      const findBook = books.find((item) => item.id === bookId);

      if (findBook != undefined) {
        books.forEach((element, index) => {
          if (element.id == bookId) {
            books.splice(index, 1);
          }
        });

        return h
          .response({
            status: "success",
            message: "Buku berhasil dihapus",
          })
          .code(200);
      }

      return h
        .response({
          status: "fail",
          message: "Buku gagal dihapus. Id tidak ditemukan",
        })
        .code(404);
    } catch (error) {
      console.error(`Error ${error}`);
      return h
        .response({
          message: `Error: ${error.message}`,
        })
        .code(500);
    }
  },
};
