const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = () => {
    if (pageCount === readPage) return true;
    return false;
  };

  if (!name) {
    const res = h.response({
      status: 'fail',
      msg: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    res.code(400);
    return res;
  }

  if (pageCount < readPage) {
    const res = h.response({
      status: 'fail',
      msg: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    res.code(400);
    return res;
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished: finished(), reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.find((book) => book.id === id) !== null;

  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Berhasil menambahkan buku',
      data: {
        bookId: id,
      },
    });

    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku',
  });
  res.code(500);
  return res;
};

const getBooks = (req, h) => {
  const { name, reading, finished } = req.query;
  if (name) {
    const filtered = books.filter((book) => book?.name.toLowerCase().includes(name.toLowerCase()));

    if (filtered.length === 0) {
      const res = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      res.code(404);
      return res;
    }

    return {
      status: 'success',
      data: {
        books: filtered,
      },
    };
  } if (reading) {
    if (reading === '0') {
      const filtered = books.filter((book) => book?.reading === false);

      return {
        status: 'success',
        data: {
          books: filtered,
        },
      };
    } if (reading === '1') {
      const filtered = books.filter((book) => book?.reading === true);

      return {
        status: 'success',
        data: {
          books: filtered,
        },
      };
    }
  } if (finished) {
    if (finished === '0') {
      const filtered = books.filter((book) => book?.finished === false);

      return {
        status: 'success',
        data: {
          books: filtered,
        },
      };
    } if (finished === '1') {
      const filtered = books.filter((book) => book?.finished === true);

      return {
        status: 'success',
        data: {
          books: filtered,
        },
      };
    }
  }

  return {
    status: 'success',
    data: {
      books: books.map((row) => ({
        id: row.id,
        name: row.name,
        publisher: row.publisher,
      })),
    },
  };
};

const getBookById = (req, h) => {
  const { id } = req.params;

  const book = books.find((row) => row.id === id);
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  res.code(404);
  return res;
};

const editBookById = (req, h) => {
  const { id } = req.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const res = h.response({
      status: 'fail',
      msg: 'Gagal memperbarui  buku. Mohon isi nama buku',
    });

    res.code(400);
    return res;
  }

  if (pageCount < readPage) {
    const res = h.response({
      status: 'fail',
      msg: 'Gagal memperbarui  buku. readPage tidak boleh lebih besar dari pageCount',
    });

    res.code(400);
    return res;
  }

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const res = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  res.code(404);
  return res;
};

const deleteBookById = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    const res = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal menghapus buku. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

module.exports = {
  addBook, getBooks, getBookById, editBookById, deleteBookById,
};
