const JWT = require('jsonwebtoken')
const NewUsers = require('../models/users')
const auth = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace('Bearer ', '')
        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        const user = await NewUsers.findOne({
            _id: decoded._id,
            'tokens.token': token
        })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
            // console.log(req.user)
    } catch (e) {
        res.status(401).send("Please authenticate")
    }
    next()
}
module.exports = auth