const {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    // Menyimpan buku
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },

  {
    // Menampilkan seluruh buku
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler,
  },

  {
    // Menampilkan detail buku
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },

  {
    // Mengubah data buku
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },

  {
    // Menghapus buku
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },

  // Tambahan
  {
    method: 'GET',
    path: '/',
    handler: () => {
      return 'Ini adalah halaman Homepage';
    },
  },

  {
    method: '*',
    path: '/',
    handler: () => {
      return 'Halaman tidak dapat diakses dengan method tersebut';
    },
  },

  {
    method: '*',
    path: '/{any*}',
    handler: () => {
      return 'Halaman tidak ditemukan';
    },
  },
];

module.exports = routes;
