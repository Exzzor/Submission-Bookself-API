const request = require('hapi/lib/request');
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h)=>{
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
  
  if (!name) {
    const response = h
    .response({
      status: 'fail',
      message: 'Gagal menambahkan buku,Mohon isi nama buku',
    })
    .code(400);
    return response;
  }
  if (readPage > pageCount){
    const response = h
    .response({
      status: 'fail',
      message: 'Gagal menambahkan buku.readPage tidak boleh lebih besar dari pageCount',
    })
    .code(400);
    return response;
  }
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertAt = new Date().toISOString();
  const updatedAt = insertAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((note) => note.id === id).length > 0; 

  if(isSuccess){
    const respone = h 
    .response({
      status:'success',
      message:'Buku berhasil ditambahkan',
      data:{
        bookId: id,
      },
    })
    .code(201);
    return response;
  }

  const response = h
  .response({
    status:'fail',
    message:'Buku gagal ditambahkan',
  })
  .code(500);
  return response;
};

const getAllBookHandler = (request, h) =>{
  const {name,reading,finished}=request.query;

  if(!name && !reading && !finished){
    const response = h 
    .response({
      status:'success',
      data:{
        books:books.map((book) => ({
          id : book.id,
          name:book.name,
          publisher:book.publisher,
        })),
      },
    })
    .code(200);
    return response;
  }
  if (name){
    const filterBooksName = books.filter((book)=> {
      const nameRegex = new RegExp(name,'gi');
      return nameRegex.test(book.name);
    });
    const response = h
    .response({
      status:'success',
      data:{
        books:filterBooksName.map((book)=>({
          id:book.id,
          name:book.name,
          publisher:book.publisher,
        })),
      },
    })
    .code(200);
    return response;
  }
  if (reading){
    const filterBooksReading = books.filter(
      (book)=> Number(book.reading)===Number(reading),
    );
    const response = h
    .response({
      status: 'success',
      data: {
        books: filteredBooksReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200);
  return response;
  }
  
}
