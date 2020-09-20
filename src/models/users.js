const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')
const userSchema = mongoose.Schema({
    name: {
        required: true,
        trim: true,
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new mongoose.Error('this is not looks like Email')
            }
        }

    },
    age: {
        required: true,
        trim: true,
        type: Number
    },
    password: {
        required: true,
        trim: true,
        type: String,

        validate(value) {
            if (value.length <= 6) {
                throw new Error('password must be greater than 6')
            }
            if (validator.isAlpha(value)) {
                throw new Error('string only letters')
            }
        },
        trim: true

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.methods.getPublicProfile = function() {

    const userobj = this.toObject()

    delete userobj.password
    delete userobj.tokens
    delete userobj.avatar
    return userobj
}
userSchema.methods.findByToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
        // console.log(token)
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token

}
userSchema.statics.findByEmail = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}
userSchema.pre('remove', async function(next) {
    try {
        await Task.deleteMany({ owner: user._id })
        next()
    } catch {
        next()
    }
})
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User