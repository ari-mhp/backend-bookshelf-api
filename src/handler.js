/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const booksCollection = require('./books');

const addBookHandler = (request, h) => {
  // Ambil value dari body
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Buat id menggunakan nanoid 16 karakter
  const id = nanoid(16);

  // Buat status finished jika pageCount sama dengan readPage
  const finished = (pageCount === readPage);

  // Buat properti insertedAt dari class Date()
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Cek nama buku
  // Harus memiliki property name
  // Harus bertipe string dan tidak boleh kosong
  const nameInsterted = Boolean(
      (request.payload.hasOwnProperty('name')) &
      (typeof name == 'string') &
      (Boolean(name)),
  );

  if (!nameInsterted) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Cek readPage tidak boleh melebihi pageCount
  const notOverReadPage = !(readPage > pageCount);

  if (!notOverReadPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Masukkan buku baru ke booksCollection
  booksCollection.push(newBook);

  // Cek id buku apakah sudah masuk
  const bookInserted = booksCollection.filter((book) => book.id === id).length > 0;

  // Jika buku berhasil ditambahkan
  if (bookInserted) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // Jika buku gagal ditambahkan
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku',
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  // Variabel untuk menyimpan array hasil filter query
  let namefilterBook;
  let readfilterBook;
  let finishfilterBook;

  // Jika ada query 'name'
  if (name !== undefined) {
    namefilterBook = booksCollection.filter((book) => {
      return book.name.toLowerCase().includes(name.toLowerCase());
    });
  }

  // Jika ada query 'reading'
  if (reading !== undefined) {
    // Jika reading = 1
    if (reading == 1) {
      readfilterBook = booksCollection.filter((book) => {
        return book.reading === true;
      });
    } else {
      // Jika reading = 0
      readfilterBook = booksCollection.filter((book) => {
        return book.reading === false;
      });
    }
  }

  // Jika ada query 'finished'
  if (finished !== undefined) {
    // Jika finished = 1
    if (finished == 1) {
      finishfilterBook = booksCollection.filter((book) => {
        return book.finished === true;
      });
    } else {
      // Jika finished = 0
      finishfilterBook = booksCollection.filter((book) => {
        return book.finished === false;
      });
    }
  }

  // Simpan hasil query ke object queryBook
  const queryBook = {namefilterBook, readfilterBook, finishfilterBook};
  let resultBook = [];

  // Gabungkan setiap value object ke array
  // Untuk menghilangkan keys
  Object.keys(queryBook).forEach((key) => {
    resultBook = resultBook.concat(queryBook[key]);
  });

  // FIlter hasil agar tidak ada null
  const finalBook = resultBook.filter((item) => {
    return item != null;
  });

  // Filter hasil yang duplikat
  // Cek dari id yang sama
  const uniquefinalBook = finalBook.filter((obj, index) => {
    return index === finalBook.findIndex((o) => obj.id === o.id);
  });

  // Jika ada query yang dimasukkan (name, reading, finished)
  if (name || reading || finished) {
    const response = h.response({
      status: 'success',
      data: {
        // map : untuk memanggil setiap item di object booksCollection
        // Untuk mengambil properti id, name, dan publisher saja
        books: uniquefinalBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else {
    // Jika tidak ada query yang dimasukkan
    const response = h.response({
      status: 'success',
      data: {
        // map : untuk memanggil setiap item di object booksCollection
        // Untuk mengambil properti id, name, dan publisher saja
        books: booksCollection.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
  // Ambil id dari parameter request
  const {bookId} = request.params;

  // Filter buku yang sama dengan id tersebut
  const book = booksCollection.filter((book) => book.id === bookId)[0];

  // Jika buku ditemukan
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  } else {
    // Jika buku tidak ditemukan
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const editBookByIdHandler = (request, h) => {
  // Ambil id dari parameter request
  const {bookId} = request.params;

  // Ambil value dari body
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Cek nama harus dimasukkan
  // Bertipe string dan tidak boleh kosong
  const nameInsterted = Boolean(
      (request.payload.hasOwnProperty('name')) &
      (typeof name == 'string') &
      (Boolean(name)),
  );

  if (!nameInsterted) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Cek readPage tidak boleh melebihi pageCount
  const notOverReadPage = !(readPage > pageCount);

  if (!notOverReadPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Update waktu perubahan
  const updatedAt = new Date().toISOString();

  // Update status finish
  const finished = pageCount === readPage;

  // Cari index buku yang sama dengan id tersebut
  const index = booksCollection.findIndex((book) => book.id === bookId);

  // Jika buku ditemukan
  if (index !== -1) {
    booksCollection[index] = {
      // spread (...) property dari booksCollection[index]
      ...booksCollection[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } else {
    // Jika id tidak ditemukan
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  // Ambil id dari parameter request
  const {bookId} = request.params;

  // Ambil index buku dengan id tersebut
  const index = booksCollection.findIndex((book) => book.id === bookId );

  // Jika buku ditemukan
  if (index !== -1) {
    // Untuk menghapus buku menggunakan fungsi splice
    booksCollection.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
