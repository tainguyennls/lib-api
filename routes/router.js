var express = require('express')
var router = express()

const authorController = require('./../controllers/author');
const subjectController = require('./../controllers/subject');
const librarianController = require('./../controllers/librarian');
const bookController = require('./../controllers/book');
const readerTypeController = require('./../controllers/reader_type');
const bookTitleController = require('./../controllers/book_title');

// Author
router.route('/authors')
    .get(authorController.getAllAuthors)
    .post(authorController.createAnAuthor)

router.route('/authors/:idAuthor')
    .get(authorController.getAnAuthor)
    .put(authorController.updateAnAuthor)

router.route('/authors/status/:idAuthor')
    .delete(authorController.deleteAnAuthor)

// Subject
router.route('/subjects')
    .get(subjectController.getAllSubjects)
    .post(subjectController.createAnSubject)

router.route('/subjects/:idSubject')
    .get(subjectController.getAnSubject)
    .put(subjectController.updateAnSubject)

router.route('/subjects/status/:idSubject')
    .delete(subjectController.deleteAnSubject)

// Librarian
router.route('/librarians')
    .get(librarianController.getAllLibrarians)
    .post(librarianController.createAnLibrarian)

router.route('/librarians/:idLibrarian')
    .get(librarianController.getAnLibrarian)
    .put(librarianController.updateAnLibrarian)

router.route('/librarians/status/:idLibrarian')
    .delete(librarianController.deleteAnLibrarian)

// Book
router.route('/books')
    .get(bookController.getAllBooks)
    .post(bookController.createAnBook)

router.route('/books/:idBook')
    .get(bookController.getAnBook)
    .put(bookController.updateAnBook)

router.route('/books/status/:idBook')
    .delete(bookController.deleteAnBook)

// ReaderType
router.route('/reader-type')
    .get(readerTypeController.getAllReaderTypes)
    .post(readerTypeController.createAnReaderType)

router.route('/reader-type/:idReaderType')
    .get(readerTypeController.getAnReaderType)
    .put(readerTypeController.updateAnReaderType)

router.route('/reader-type/status/:idReaderType')
    .delete(readerTypeController.deleteAnReaderType)

// Booktitle
router.route('/book-title')
    .get(bookTitleController.getAllBookTitles)
    .post(bookTitleController.createAnBookTitle)

router.route('/book-title/:idBookTitle')
    .get(bookTitleController.getAnBookTitle)
    .put(bookTitleController.updateAnBookTitle)

router.route('/book-title/status/:idBookTitle')
    .delete(bookTitleController.deleteAnBookTitle)

module.exports = router