const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
    let token = req.headers.authorization;
    try {
        let payload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = payload;
        next()
    }
    catch (err) {
        return res.status(401).json({
            status: false,
            errors: 'Invalid token'
        })
    }
}

exports.verified = (req, res, next) => {
    let token = req.headers.authorization;
    try {
        let payload = jwt.verify(token, process.env.SECRET_KEY);
        req.ads = payload;
        next()
    }
    catch (err) {
        return res.status(401).json({
            status: false,
            errors: 'Invalid token'
        })
    }
}

module.exports = authenticate;