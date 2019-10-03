const jwt = require('jsonwebtoken');
const { key } = require('./../utils/constant');
const { ErrorResult } = require('./../utils/base_response');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.json(ErrorResult(401, 'Not authenticated'));
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, key);
    } catch (err) {
        return res.json(ErrorResult(401, err.message));
    }
    if (!decodedToken) {
        return res.json(ErrorResult(401, 'Not authenticated'));
    }
    req.userId = decodedToken.userId;
    req.userName = decodedToken.userName;
    next();
}