const express = require('express')
    // const { update } = require('../models/tasks')
const Task = require('../models/tasks')
const auth = require('../middleware/authentication')
const router = new express.Router()
router.post('/tasks', auth, async(req, res) => {
    // let task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/tasks', auth, async(req, res) => {
    try {
        // const data = await Task.find()
        const task = await Task.findOne({ owner: req.user._id })
        res.status(201).send(ta)
    } catch (error) {
        res.status(500).send(error)
    }

})
router.get('/tasks/:id', auth, async(req, res) => {
    try {
        // const data = await Task.findById(req.params.id)
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send("jgj")
        }
        res.status(201).send(task)
    } catch (error) {
        res.status(404).send(error)
    }
})
router.patch('/tasks/:id', async(req, res) => {
    const allowdUpdates = ['task', 'completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => { return allowdUpdates.includes(update) })
    if (!isValidOperation) {
        res.status(400).send('Invalid updates')
    }
    try {
        // const data = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // const data = await Task.findById(req.params.id)
        const data = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!data) {
            return res.status(404).send()
        }
        updates.forEach((update) => {

            data[update] = req.body[update]
        })
        await data.save()

        res.status(201).send(data)
    } catch (error) {
        res.status(500).send()
    }

})
router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        // const data = await Task.findByIdAndDelete(req.params.id)
        const data = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!data) {
            return res.status(404).send()
        }
        res.send(data)
    } catch (error) {
        res.status(500).send()
    }

})
module.exports = router