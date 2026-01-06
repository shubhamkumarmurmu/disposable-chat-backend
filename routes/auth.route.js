const express = require('express');
const router = express.Router();
const {registerController,loginController, logoutController} = require('../controllers/auth.controller');
const {registerMiddleware, verifyJwt} = require('../middlewares/auth.middleware');

router.post('/register',registerMiddleware,registerController);

router.post('/login',loginController);

router.get('/logout',verifyJwt,logoutController);

module.exports = router;