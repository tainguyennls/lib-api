const express = require('express');
const { Reader, LoanSlip, Librarian, LoanSlipDetail } = require('../database/db');
const { ErrorResult, Result } = require('./../utils/base_response');
const { hashId } = require('../utils/helper');
const router = express.Router();

router.use((req, res, next) => {
    next();
});

router.get('/', async (req, res) => {
    try {
        const loanSlips  = await LoanSlip.findAll({ raw: true });
        const readers    = await Reader.findAll({ raw: true });
        const librarians = await Librarian.findAll({ raw: true });
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
});

router.get('/:id', (req, res) => {
    LoanSlip.findByPk(req.params.id).then(loanSlip => {
        if (loanSlip != null) {
            res.json(Result(loanSlip));
        } else {
            res.json(ErrorResult(204, "Not loan slip found !"));
        }
    });
});

router.post('/', (req, res) => {
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

});

// router.delete('/:id', (req, res) => {
//     LoanSlipPayInfo.findAll({
//         where: {
//             LSP_ID: req.params.id
//         }
//     }).then(type => {
//         if (Array.isArray(type) && type.length === 0) {
//             LoanSlipPay.destroy({
//                 where: {
//                     id: req.params.id
//                 }
//             }).then(type => {
//                 res.json(Result(type));
//             }).catch(err => {
//                 res.json(ErrorResult(500, err.errors));
//             });
//         } else {
//             res.json(ErrorResult(200, 'Has Frimary Key'));
//         }
//     })
// });

router.put('/status/:id', (req, res) => {
    LoanSlip.update({
        where: {
            idLoanSlip: req.params.id
        }
    }, {
        iActive: 0,
    }).then(type => {
        res.json(Result(type));
    }).catch(err => {
        res.status(500).json(ErrorResult(500, err.errors));
    });
});

module.exports = router;