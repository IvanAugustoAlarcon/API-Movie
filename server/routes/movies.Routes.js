const express = require('express')
const router = express.Router()
const { getMovies, getMovieById, getRandomMovie, updateMovie, deleteMovie, createMovie } = require('../controllers/movie.Controller')
const { protect, admin } = require('../middleware/auth.Middleware')

router.get('/', getMovies)
router.get('/:id', getMovieById)
router.get('/random', getRandomMovie)

router.put('/:id', protect, admin, updateMovie)
router.delete('/:id', protect, admin, deleteMovie)
router.post('/', protect, admin, createMovie)

module.exports = router