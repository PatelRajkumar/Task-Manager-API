const jwt = require('jsonwebtoken')
const User = require('../models/users')
const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'rajisrichboy')
            // console.log(decoded)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
    } catch (error) {
        res.status(401).send({ error: 'Unable to Authenticate' })
    }

    next()
}
module.exports = auth