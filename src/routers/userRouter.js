const express = require('express')
    // const { update } = require('../models/users')
const User = require('../models/users')
const sharp = require('sharp')
const auth = require('../middleware/authentication')
const multer = require('multer')
const emails = require('../emails/accounts')
const sendWelcomeEmail = emails.sendWelcomeEmail
const { leavingEmail } = require('../emails/accounts')
const { remove } = require('../models/users')
const router = new express.Router()
router.post('/users', async(req, res) => {
    const user = await new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.findByToken()
        const userdata = user.getPublicProfile()
        res.status(201).send({ userdata, token })
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/users/me', auth, async(req, res) => {
    const data = req.user.getPublicProfile()
    res.send(data)
})
router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByEmail(req.body.email, req.body.password)
        const token = await user.findByToken()
        const userdata = user.getPublicProfile()
        res.send({ userdata, token })
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
router.post('/users/logoutall', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
router.patch('/users/me', auth, async(req, res) => {
    const allowdUpdates = ['name', 'email', 'age', 'password', ]
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => {
        return allowdUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).send('invalid Inputs')
    }
    try {
        // const data = await User.findById(req.params.id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
            // const data = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            // if (!data) {
            //     return res.status(404).send()
            // }
        const data = req.user.getPublicProfile()
        res.send(data)
    } catch (error) {
        res.status(500).send()
    }
})
router.delete('/users/me', auth, async(req, res) => {
    try {
        const data = req.user
        console.log(data.email)
        console.log(data)
        leavingEmail(data.email, data.name)
        try { await data.remove() } catch (e) {
            console.log(e)
        }
        await res.send(data)

    } catch (error) {
        res.status(500).send(error)
    }

})
const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('only jpg & jpeg files are allowd'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('upload'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).png().resize({ height: 300, width: 300 }).toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    await res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
router.get('/users/:id/avatar', async(req, res) => {
    try {
        const data = await User.findById(req.params.id)
        if (!data || !data.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(data.avatar)
    } catch (e) {
        res.status(404).send(e)
    }

})
router.delete('user/me/avatar', auth, (req, res) => {
    delete req.user.avatar
    req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(404).send({ error: error.message })
})
module.exports = router