const express = require('express')
const router = express.Router()
const { registerUser, 
    loginUser, 
    getLikedMovies, 
    addLikedMovie,
    deleteLikedMovies } = require('../controllers/user.Controller.js')
const { protect } = require('../middleware/auth.Middleware')

router.post('/', registerUser)
router.post('/login', loginUser)

router.get('/favorites', protect, getLikedMovies)
router.post('/favorites', protect, addLikedMovie)
router.post('/favorites/delete', protect, deleteLikedMovies)

module.exports = router