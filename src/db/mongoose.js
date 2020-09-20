const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect(process.env.MONGO_CON, {
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