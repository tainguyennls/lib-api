const express = require('express');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
})

const upload = multer({
    storage: storage
});

router.post('/', upload.single('photo'), function (req, res) {
    console.log(req.file);
    res.end(req.file.filename)
})

module.exports = router;