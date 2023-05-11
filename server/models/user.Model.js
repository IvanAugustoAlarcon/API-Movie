const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Add a name']
    },
    email: {
        type: String,
        require: [true, 'Add a email'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'Add a password']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    likedMovies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ]
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)