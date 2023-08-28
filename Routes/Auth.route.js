const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/Auth.Controller')

router.post('/register', AuthController.register)

router.post('/login', AuthController.login)

router.post('/refresh-token', AuthController.refreshToken)

router.delete('/logout', AuthController.logout)

router.get('/google', AuthController.googleAuth);

router.get('/google/callback', AuthController.googleCallback);

router.get('/github', AuthController.githubAuth);

router.get('/github/callback', AuthController.githubCallback);



module.exports = router
