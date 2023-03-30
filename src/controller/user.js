const NewUsers = require('../models/users')
const auth = require('../middleware/auth')

const Create = async(req, res) => {
    try {

        const user = await NewUsers.create(req.body);
        const token = await user.generateAuthToken()

        res.status(201).send({
            user,
            token
        })
    } catch (err) {
        res.status(500).send(err)
    }
}
const Find_All_User =
    async(req, res) => {
        try {

            const user = await NewUsers.find({})
            res.status(201).send(user)
        } catch (err) {
            res.status(500).send(err)
        }
    }
const FindById =
    async(req, res) => {
        const _id = req.params.id
        try {
            const user = await NewUsers.findById(_id)
            if (!user) {
                return res.status(400).send()
            }
            res.status(201).send(user)
        } catch (err) {
            res.status(500).send(err)
        }
    }
const Update =
    async(req, res) => {
        try {
            const updated = Object.keys(req.body)
            const allowed_Update = ['name', 'password', 'age', 'email']
            const test_allowed = updated.every(update => allowed_Update.includes(update))
            if (!test_allowed) {
                res.status(400).send("Update not valid")
            }
            const user = await NewUsers.findById(req.params.id)
            updated.forEach(update => user[update] = req.body[update])
            await user.save()
                // const user = await NewUsers.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            if (!user) {
                res.status(400).send('Update is not valid')
            }
            res.status(200).send(user)


        } catch (err) {
            console.log(err)
            res.status(404).send({ Error: err })

        }
    }
const Delete = async(req, res) => {
    try {
        const user = await NewUsers.findByIdAndDelete(req.params.id)
        if (!user) {
            res.status(400).send("user not valid ")
        }
        res.status(200).send({ User: user })

    } catch (err) {
        res.send(err)
    }
}
const Login = async(req, res) => {
    try {
        const user = await NewUsers.Credentials(
            req.body.email,
            req.body.password)
        const Token = await user.generateAuthToken()


        res.send({
            user,
            Token
        })
    } catch (e) {
        res.status(400).send()
    }
}

module.exports = {
    FindById,
    Find_All_User,
    Update,
    Create,
    Delete,
    Login



}