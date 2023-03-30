const express = require('express')
const auth = require('../middleware/auth')
const NewUsers = require('../models/users')
const multer = require('multer')
const { SendWelcomeEmail, SendCanselationEmail } = require('../emails/account')
    // const sharp = require('sharp')

// const { Create, FindById, Find_All_User, Update, Delete, Login } = require('../controller/user')
const router = new express.Router()
router.post('/users', async(req, res) => {
    try {

        const user = await NewUsers.create(req.body);
        SendWelcomeEmail(user.email, user.name);
        // const token = await user.generateAuthToken()

        res.status(201).send(
            user
        )
    } catch (err) {
        res.status(500).send(err)
    }
});

router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)

});
router.get('/users/;id',
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
    });
router.patch('/users/me', auth, async(req, res) => {
    try {
        const updated = Object.keys(req.body)
        const allowed_Update = ['name', 'password', 'age', 'email']
        const test_allowed = updated.every(update => allowed_Update.includes(update))
        if (!test_allowed) {
            res.status(400).send("Update not valid")
        }
        // const user = await NewUsers.findById(req.params.id)
        updated.forEach(update => req.user[update] = req.body[update])
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
});
router.delete('/users/me', auth, async(req, res) => {
    try {
        // const user = await NewUsers.findByIdAndDelete(req.params.id)
        // if (!user) {
        //     res.status(400).send("user not valid ")
        // }
        await req.user.remove()
        SendCanselationEmail(req.user.email, req.user.name);

        res.status(200).send(req.user)

    } catch (err) {
        res.send(err)
    }
});
router.post('/users/login', async(req, res) => {
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
});
router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            console.log(token)

            return token.token !== req.token
        })
        console.log(req.user)
        await req.user.save();
        res.status(200).send()


    } catch (err) {
        res.status(500).send({ err: err })

    }
});
router.post('/users/logoutALL', auth, async(req, res) => {
        try {
            req.user.tokens = []
            await req.user.save()
            res.status(200).send()

        } catch (err) {
            res.status(404).send(err)

        }

    })
    //multer

// const storage = multer.memoryStorage()
const upload = multer({
    limits: {
        fileSize: 1000000,

    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/.(jpg|png)$/))
            return cb(new Error("must type file image"))
        cb(undefined, true)

    }

});
router.post('/upload/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error,
    req,
    res,
    next
) => {
    res.
    status(400).send({ error: error.message })

})
router.delete('/delete/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined;
    await req.user.save
    res.send(req.user)

}, (error,
    req,
    res,
    next
) => {
    res.
    status(400).send({ error: error.message })

})
router.get('/get/me/avatar', auth, async(req, res) => {
    res.set("content_Type", "image/png")
    res.send(req.user.avatar)
})


// router.route('/users').get(Find_All_User).post(Create)
// router.route('/users/login').post(Login)
// router.route('/users/:id').get(FindById).patch(Update).delete(Delete)

module.exports = router