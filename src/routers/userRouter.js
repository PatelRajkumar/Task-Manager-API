const express = require('express')
    // const { update } = require('../models/users')
const User = require('../models/users')
const router = new express.Router()
const auth = require('../middleware/authentication')
router.post('/users', async(req, res) => {
    const user = await new User(req.body)
    try {
        await user.save()
        console.log(user)
        const token = await user.findByToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
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
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})
router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }

})
module.exports = router