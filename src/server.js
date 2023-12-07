"use strict";
const Hapi = require("@hapi/hapi");
const {
  getAllBooks,
  addBook,
  getBookById,
  editBook,
  deleteBook,
} = require("./routes/bookshelf.route");

const PORT = 9000;
const host = "localhost";

const startServer = async () => {
  try {
    const server = Hapi.server({
      port: PORT,
      host: host,
    });

    server.route([
      {
        method: "GET",
        path: "/",
        handler: (req, h) => {
          const data = {
            message: "Welcome to bookshelf app",
          };

          return h.response(data).code(200);
        },
      },
      getAllBooks,
      getBookById,
      addBook,
      editBook,
      deleteBook,
    ]);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

startServer();
