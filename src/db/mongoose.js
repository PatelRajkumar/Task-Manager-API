const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


// const tasks = new Task({
//     task: 'h',
//     completed: true

// })
// tasks.save().then(
//         () => console.log(tasks)
//     ).catch(
//         () => console.log(error)
//     )