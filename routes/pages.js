// 익스프레스를 사용하는 이유 중 하나가 라우팅을 깔끔하게 관리할 수 있다는 점이다.
// 예를 들어, app.js에서 app.get 같은 메서드가 라우터 부분이다.
// 그러나 라우터를 많이 연결하면 app.get() 도배가 되어버려서, 코드가 매우 길어진다.
// 그래서 익스프레스에서는 라우터를 분리할 수 있는 방법을 제공한다.

const express = require('express');

const router = express.Router();

router.get('/', (req, res)=>{
    res.render('index');
});


router.get('/register', (req, res)=>{
    res.render('register');
});

router.get('/login', (req, res)=>{
    res.render('login');
});

module.exports = router;
