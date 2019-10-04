const { hashId } = require('../utils/helper');
const { ErrorResult, Result } = require('./../utils/base_response');
const { Reader, LoanSlip, Librarian, LoanSlipDetail } = require('../database/db');

module.exports.getAllLoanSlips = async (req, res, next) => {
    try {
        const loanSlips = await LoanSlip.findAll({
            raw: true
        });
        const readers = await Reader.findAll({
            raw: true
        });
        const librarians = await Librarian.findAll({
            raw: true
        });
        const output = loanSlips.map(loanSlip => {
            const reader = readers.filter(reader => reader.idReader === loanSlip.idReader);
            const librarian = librarians.filter(librarian => librarian.idLibrarian === loanSlip.idLibrarian);
            return {
                status: loanSlip.status,
                quantity: loanSlip.quantity,
                userName: reader[0].fullName,
                dateBorrow: loanSlip.dateBorrow,
                idLoanSlip: loanSlip.idLoanSlip,
                librarianName: librarian[0].fullName,
                dateWillReturn: loanSlip.dateWillReturn,
            }
        });
        res.json(Result(output));
    } catch (error) {
        res.json(ErrorResult(500, error));
    }
}

module.exports.getAnLoanSlip = async (req, res, next) => {
    try {
        const loanSlip = await LoanSlip.findByPk(req.params.idLoanSlip);
        const reader = await Reader.findByPk(loanSlip.idReader);
        const librarian = await Librarian.findByPk(loanSlip.idLibrarian);
        const output = {
            status: loanSlip.status,
            quantity: loanSlip.quantity,
            userName: reader.fullName,
            dateBorrow: loanSlip.dateBorrow,
            idLoanSlip: loanSlip.idLoanSlip,
            librarianName: librarian.fullName,
            dateWillReturn: loanSlip.dateWillReturn,
        };
        res.json(Result(output));
    } catch (error) {
        res.json(ErrorResult(500, error));
    }
}

module.exports.createAnLoanSlip = function (req, res, next) {
    const loanSlip = {
        idLoanSlip: hashId(new Date().toLocaleString()),
        idReader: req.body.user,
        idLibrarian: req.body.librarian,
        dateBorrow: new Date(req.body.borrowTime[0]).toLocaleString(),
        dateWillReturn: new Date(req.body.borrowTime[1]).toLocaleString(),
        quantity: req.body.quantity,
        status: req.body.status,
        iActive: 1,
    };
    const books = req.body.books;
    const bookDetail = books.map(book => {
        return {
            idBook: book.book.idBook,
            iActive: 1,
            idLoanSlip: loanSlip.idLoanSlip,
        }
    });
    LoanSlip.create(loanSlip)
        .then(result => {
            if (result != null) {
                LoanSlipDetail.bulkCreate(bookDetail, {
                    returning: true,
                });
                res.json(Result(result));
            }
        })
        .catch(error => ErrorResult(500, error.errors));
}

module.exports.deleteAnLoanSlip = function (req, res, next) {
    LoanSlip.findByPk(req.params.idLoanSlip).then(loanSlip => {
        if (loanSlip != null) {
            loanSlip.update({
                    isActive: 0,
                })
                .then(resp => res.json(Result(resp)))
                .catch(err => res.json(ErrorResult(500, err.errors)));
        } else {
            res.json(ErrorResult(204, "Not data found !"));
        }
    });
}

module.exports.searchLoanSlip = function (req, res, next) {
    // Search LoanSlip from db.
}