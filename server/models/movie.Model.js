const mongoose = require('mongoose')

const moviesSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    name: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    category: [{
        type: String,
        require: true
    }],
    language: {
        type: String,
        require: true
    },
    year: {
        type: Number,
        require: true
    },
    time: {
        type: Number,
        require: true
    },
    video: {
        type: String,
        require: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Movie', moviesSchema)