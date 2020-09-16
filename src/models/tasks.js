const mongoose = require('mongoose')
const taskSchema = mongoose.Schema({
    task: {
        type: String,
        required: true,

    },
    completed: {
        required: true,
        type: Boolean
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Task = mongoose.model('Tasks', taskSchema)
module.exports = Task