const express = require('express');
const {
    Reader
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
    Reader.findAll({
        where: {
            isActive: 1
        }
    }).then(reader => {
        res.json(Result(reader));
    });
});

router.get('/:idReader', (req, res) => {
    Reader.findByPk(req.params.idReader).then(reader => {
        if (reader != null) {
            res.json(Result(reader));
        } else {
            res.json(ErrorResult(204, "Not reader found !"));
        }
    });
});

router.post('/', (req, res) => {
    const usr = {
        idReader: hashId(new Date().toLocaleString()),
        ...req.body,
        iActive: 1,
    }
    Reader.create(usr).then(response => {
        res.json(Result(response));
    }).catch(err => {
        res.json(ErrorResult(500, err.errors));
    });
});

router.put('/:idReader', (req, res) => {
    Reader.findByPk(req.params.idReader).then(reader => {
        if (reader != null) {
            reader.update({
                fullName: req.body.fullName,
                identityCardNumber: req.body.identityCardNumber,
                gender: req.body.gender,
                address: req.body.address,
                dateOfBirth: req.body.address,
                email: req.body.email,
                phone: req.body.phone,
                registerDate: req.body.registerDate,
                avatar: req.body.avatar,
                userName: req.body.userName,
                password: req.body.password,
                idReaderType: req.body.idReaderType,

            }).then(response => {
                res.json(Result(response));
            }).catch(err => {
                res.json(ErrorResult(500, err.errors));
            });
        } else {
            res.json(ErrorResult(204, "Not reader found !"));
        }
    });
});

router.put('/status/:idReader', (req, res) => {
    Reader.update({
        where: {
            idReader: req.params.idReader
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