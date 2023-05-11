const asyncHandler = require('express-async-handler')
const Movie = require('../models/movie.Model')

const getMovies = asyncHandler( async (req, res) => {
    try {
        const { category,language, year, search } = req.query
        let query = {
            ...(category && { category:{$regex:category} }),
            ...(language && { language }),
            ...(year && { year }),
            ...(search && { name: { $regex: search, $options: 'i' } })
        }

    //Load more movies functionality
        // const page = Number(req.query.pageNumber) || 1
        // const limit = 30
        // const skip = (page - 1) * limit

        const movies = await Movie.find(query) //.sort({ createdAt: -1 }).skip(skip).limit(limit)
        
        // const count = await Movie.countDocuments(query)

        res.json({
            movies}) 
            // page, 
            // pages: Math.ceil(count / limit), 
            // totalMovies: count})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

const getMovieById = asyncHandler( async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
        if (movie) {
            res.status(200).json(movie)
        } else {
            res.status(404)
            throw new Error('Movie not found')
        }
        
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

const getRandomMovie = asyncHandler( async (req, res) => {
    try {
        const movies = await Movie.aggregate([{ $sample: { size: 8 } }])
        res.status(200).json(movies)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

const updateMovie = asyncHandler( async (req, res) => {
    try {
        const {
            name,
            desc,
            image,
            category,
            language,
            year,
            time,
            video
        } = req.body
        const movie = await Movie.findById(req.params.id)

        if (movie) {
            movie.name = name || movie.name,
            movie.desc = desc || movie.desc,
            movie.image = image || movie.image,
            movie.category = category || movie.category,
            movie.language = language || movie.language,
            movie.year = year || movie.year,
            movie.time = time || movie.time,
            movie.video = video || movie.video

            const updatedMovie = await movie.save()

            res.status(201).json(updatedMovie)
        } else {
            res.status(404)
            throw new Error('Movie not found')
        }
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

const deleteMovie = asyncHandler( async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
        if(movie) {
            await movie.deleteOne()
            const movies = await Movie.find()
            res.status(200).json(movies)
        } else {
            res.status(404)
            throw new Error('Movie not found')
        }
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

const createMovie = asyncHandler( async (req, res) => {
    try {
        const {
            name,
            desc,
            image,
            category,
            language,
            year,
            time,
            video
        } = req.body

        const movie = new Movie({
            name,
            desc,
            image,
            category,
            language,
            year,
            time,
            video,
            userId: req.user.id
        })
        
        if(movie) {
            const createdMovie = await movie.save()
            res.status(201).json(createdMovie)
        } else {
            res.status(400)
            throw new Error('Invalid movie data')
        }

    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

module.exports = {
    getMovies,
    getMovieById,
    getRandomMovie,
    updateMovie,
    deleteMovie,
    createMovie
}