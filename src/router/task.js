const express = require('express')
const Task = require('../models/task')

const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async(req, res) => {
    const task = await Task.create({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', auth, async(req, res) => {
    const { completed, description, limit, page, sortBy } = req.query
    const match = {}
    const sort = {}
    if (completed) {
        match.completed = req.query.completed === 'true' ? true : false
    }
    if (description) {
        match.description = req.query.description
    }
    const pages = +(page) || 1;
    const limits = +(limit) || 2;
    if (sortBy) {
        const splitWithSort = req.query.sortBy.split(':')
        sort[splitWithSort[0]] = splitWithSort[1] === 'desc' ? -1 : 1
    }
    try {

        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: +(limits) || 2,
                skip: (page - 1) * limits,
                sort
            }

        }).execPopulate();

        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {

        const task = await Task.findOne({ _id, owner: req.user._id })
        await req.user.populate('tasks').execPopulate()

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    const _id = req.params.id
    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save()


        res.send(task)
    } catch (e) {

        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router