
const express = require('express');
const authController = require('../controllers/auth');

// ../controllers/auth 에서 ../는 auth.js의
// 상위 폴더인 routes를 의미한다.

const router = express.Router();
// /register은 auth/register 의미?
router.post('/register', authController.register )

router.post('/login', authController.login);

module.exports = router;
