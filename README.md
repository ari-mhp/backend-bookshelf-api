# Bookshelf API (Rak Buku)
##### *Backend server API menggunakan framework Hapi.js*
---
Aplikasi ini menggunakan bahasa `javascript` yang berjalan menggunakan `node.js`. Berjalan di localhost (127.0.0.1) dengan port 9000 atau dengan URL `http://localhost:9000/`.

Sebelum menjalankan server, terlebih dahulu install modul yang diperlukan dengan mengetikkan
```
npm install
```
Menjalankan server dapat mengetikkan perintah pada terminal
```
npm run start
```

## Fitur
1. Menyimpan buku
2. Menampilkan seluruh buku
3. Menampilkan detail buku
4. Mengubah data buku
5. Menghapus buku

### 1. Menyimpan Buku
Aplikasi dapat menyimpan buku dengan menggunakan metode `POST` pada URL `http://localhost:9000/books` dengan melampirkan data buku pada body request berbentuk JSON seperti berikut :
```js
{
    "name": string,
    "year": number,
    "author": string,
    "summary": string,
    "publisher": string,
    "pageCount": number,
    "readPage": number,
    "reading": boolean
}
```
Apabila buku berhasil ditambahkan, server akan merespon dengan pesan *"Buku berhasil ditambahkan"* dengan status code `201`. Beberapa hal yang menyebabkan buku gagal ditambahkan yaitu :
- Tidak melampirkan properti `name` buku pada body request
- Nilai properti `readPage` (halaman yang dibaca) lebih besar dari nilai properti `pageCount` (jumlah halaman)

### 2. Menampilkan Seluruh Buku
Aplikasi dapat menampilkan seluruh buku yang disimpan dengan menggunakan metode `GET` pada URL `http://localhost:9000/books`. Aplikasi juga dapat menerima 3 masukan **query parameter** yaitu `?name`, `?reading`, dan `?finished`
- `?name` : Akan menampilkan buku yang mengandung nama sesuai masukan
    ```
    contoh : http://localhost:9000/books?name="javascript"
    ```
- `?reading` (0 atau 1) : Jika bernilai `1` akan menampilkan buku yang sedang dibaca (reading: true), jika bernilai `0` akan menampilkan buku yang tidak sedang dibaca (reading: false).
    ```
    contoh : http://localhost:9000/books?reading=1
    ```
- `?finished` (0 atau 1) : Jika bernilai `1` akan menampilkan buku yang selesai dibaca (finished: true), jika bernilai `0` akan menampilkan buku yang belum selesai dibaca (finished: false).
    ```
    contoh : http://localhost:9000/books?finished=0
    ```

### 3. Menampilkan Detail Buku
Aplikasi dapat menampilkan detail buku yang disimpan berdasarkan `bookId` yang diberikan dengan menggunakan metode `GET` pada URL `http://localhost:9000/books/<bookId>`.
Apabila `bookId` tidak ditemukan server akan merespon dengan pesan *"Buku tidak ditemukan"*

### 4. Mengubah Data Buku
Aplikasi dapat mengubah detail buku yang disimpan berdasarkan `bookId` yang diberikan dengan menggunakan metode `PUT` pada URL `http://localhost:9000/books/<bookId>`.
Server akan merespon gagal jika terdapat hal berikut :
- Tidak melampirkan properti `name` buku pada body request
- Nilai properti `readPage` (halaman yang dibaca) lebih besar dari nilai properti `pageCount` (jumlah halaman)
- Buku dengan `bookId` yang diberikan tidak ditemukan

### 5. Menghapus Buku
Aplikasi dapat menghapus buku yang disimpan berdasarkan `bookId` yang diberikan dengan menggunakan metode `DELETE` pada URL `http://localhost:9000/books/<bookId>`.
Jika tidak terdapat buku manapun dengan `bookId` yang diberikan, server akan merespon gagal.

