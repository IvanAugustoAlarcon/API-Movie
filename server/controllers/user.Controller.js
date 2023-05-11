const User = require('../models/user.Model')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password, isAdmin } = req.body
    if( !name || !email || !password ) {
        res.status(400)
        throw new Error('Please check all fields')
    }
    const userExist = await User.findOne({ email })
    if(userExist) {
        res.status(400)
        throw new Error('Email is already registered')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(400)
        throw new Error('Failed to create user')
    }
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({email})
    if(!email || !password) {
        res.status(400)
        throw new Error('Incorrect credentials')
    }
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user.id) 
        })
    } else {
        res.status(400)
        throw new Error('Incorrect credentials')
    }
})

const getLikedMovies = asyncHandler( async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('likedMovies')
        if(user) {
            res.json(user.likedMovies)
        } else {
            res.status(404)
            throw new Error('User not found')
        }
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

const addLikedMovie = asyncHandler( async (req, res) => {
    const { movieId } = req.body
    try {
        const user = await User.findById(req.user._id)
        if(user){
            const isMovieLiked = user.likedMovies.find(
                (movie) => movie?.toString() === movieId
            )
            if(isMovieLiked) {
                res.status(400)
                throw new Error('Movie already liked')
            }
            user.likedMovies.push(movieId)
            await user.save()
            res.status(200).json('Movie liked')
        } else {
            res.status(404)
            throw new Error('User not found')
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

const deleteLikedMovies = asyncHandler( async (req, res) => {
    const { movieId } = req.body
    try {
        const user = await User.findById(req.user._id)
        if(user){
            const isMovieLiked = user.likedMovies.find(
                (movie) => movie?.toString() === movieId
            )
            if(!isMovieLiked) {
                res.status(400)
                throw new Error ('Movie not found')
            }
            const index = user.likedMovies.indexOf(isMovieLiked)
            user.likedMovies.splice(index,1)
            await user.save()
            res.status(200).json(isMovieLiked)
            
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

module.exports = {
    registerUser,
    loginUser,
    getLikedMovies,
    addLikedMovie,
    deleteLikedMovies
}