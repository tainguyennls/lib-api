const express = require('express');
const {
    LoanSlipDetail, LoanSlip
} = require('../database/db');
const jwt = require('jsonwebtoken');
const helper = require('../utils/helper');
const {
    Result,
    ErrorResult,
} = require('../utils/base_response');
const {
    hashId
} = require('../utils/helper');
const router = express.Router();

router.use((req, res, next) => {
    next();
});

router.get('/', (req, res) => {
    LoanSlipDetail.findAll({
        where: {
            isActive: 1
        }
    }).then(lsDetails => {
        res.json(Result(lsDetails));
    });
});

router.get('/:idLoanSlipDetail', (req, res) => {
    LoanSlipDetail.findByPk(req.params.idLoanSlipDetail).then(lsDetail => {
        if (lsDetail != null) {
            res.json(Result(lsDetail));
        } else {
            res.json(ErrorResult(204, "Not data found !"));
        }
    });
});

router.post('/', (req, res) => {
    const usr = {
        idLoanSlipDetail: hashId(new Date().toLocaleString()),
        ...req.body,
        iActive: 1,
    }
    LoanSlipDetail.create(usr).then(response => {
        res.json(Result(response));
    }).catch(err => {
        res.json(ErrorResult(500, err.errors));
    });
});

router.put('/:idLoanSlipDetail', (req, res) => {
    LoanSlipDetail.findByPk(req.params.idLoanSlipDetail).then(lsDetail => {
        if (lsDetail != null) {
            lsDetail.update({
                idLoanSlip: req.body.idLoanSlip,
                idBook: req.body.idBook,
                dateReturn: req.body.dateReturn,
            }).then(response => {
                res.json(Result(response));
            }).catch(err => {
                res.json(ErrorResult(500, err.errors));
            });
        } else {
            res.json(ErrorResult(204, "Not book found !"));
        }
    });
});

router.put('/status/:id', (req, res) => {
    LoanSlipDetail.update({
        where: {
            idLoanSlipDetail: req.params.id
        }
    }, {
        iActive: 0,
    }).then(type => {
        res.json(Result(type));
    }).catch(err => {
        res.json(ErrorResult(500, err.errors));
    });
});

module.exports = router;