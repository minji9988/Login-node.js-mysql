const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require('cookie-parser');


dotenv.config({ path: './.env'});
//dotenv.config()는 현재 디렉터리(MOAMOA_LOGIN)의
//.env 파일을 자동으로 인식하여 환경변수를 세팅한다.
// dotenv.config(경로)는 원하는 .env 파일의 위치를 지정해서 세팅하게 하는 것

const app = express();


const db = mysql.createConnection({
  host     : process.env.DATABSE_HOST,
  port     : process.env.DATABASE_PORT,
  user     : process.env.DATABSE_USER,
  password : process.env.DATABSE_PASSWORD,
  database : process.env.DATABSE,  
});


// const db = mysql.createConnection({
//   host     : 'localhost',
//   port     : '3306',
//   user     : 'root',
//   password : '123',
//   database : 'test1'
// });



// 데이터 베이스 연결
db.connect(function(error){
  if(error){
      console.log(error);
  }else{
      console.log("MySql connected..");
  }
});

//dirname은 현재 디렉토리 경로를 의미한다.
//directory name의 합성어로 현재 파일이 위치한 폴더(directory)의
// 절대경로를 알려준다.

// 여기선 C:\Users\rnwjf\Desktop\MOAMOA_LOGIN 를 의미한다.
//path.join()안에 여러 인자를 넣으면 하나의 경로로 합쳐준다.
const publicDirectory = path.join(__dirname, './public');
// path.join(__dirname, './public')으로 작성할 경우
// C:/Users/rnwjf/Desktop/MOAMOA_LOGIN/public을 쓴 것과 동일
// ./은 현재 위치의 폴더를 의미(현재 디렉터리)

//exrpess.static은 정적파일의 기본 경로를 제공해주기 위해 사용
// 정적파일은 사용자에 의해 변하지 않는, 서버에서 파일에 변화를
// 주지 않는 이상 웹페이지에 아무런 변화가 없는 걸 뜻함.
// 정적 웹페이지의 반대로는 웹툰, 커뮤니티 사이트를 들 수 있다.
app.use(express.static(publicDirectory));
//express.static은 미들웨어 중 하나다.
// 미들웨어란 요청에 대한 응답 과정 사이에서 
// 어떠한 동작을 하는 프로그램을 뜻한다.
// 즉, express는 요청이 들어오면 그에 대한 응답을 보내주는데 
// 클라이언트가 보내는 요청을 받고 응답을 보내주는 과정의
// 중간(middle)에 개발자가 개입·간섭하여
// 요청 및 응답 객체에 대한 변경과 흐름제어을 제어한다.


// 로컬 환경에서 html 파일을 브라우저로 실행했을 경우
// 정적 파일이 정상적으로 동작하는데, 
// Node.js로 html파일을 구동하면 아무것도 적용이 안된다. 
// 이는 로컬 환경에서 html 파일을 실행했을 때 
// 정적 파일의 상대 경로와 node.js로 
// 서버를 실행하여 파일을 구동했을 때의 상대 경로가 전혀 다르기 때문이다. 이를 해결하기 위해 express.static() 미들웨어를 사용해 정적 폴더를 지정하여 서버에서는 해당 정적 폴더에 접근해 파일을 가져올 수 있다.



// from 태그로 전송된 데이터를 붙잡는 역할
// 아래 문장을 적지 않고 req.body를 통해 form 태그로
// 전송된 데이터를 console.log로 출력하고자 할 경우 출력 X
app.use(express.urlencoded({extended: false}));

//form 태그에서 전달된 데이터를 json 형태로 바꿔줌
app.use(express.json());

//쿠키를 우리 브라우저에 심을 수 있게 하는 구문
app.use(cookieParser());


//we should to tell nodejs what kind of view engine we use to show our HTML
// hbs stands for Handlebars, the name of a tool that lets you write more than just HTML.
app.set('view engine', 'hbs');


//define Routes
//사용자가 localhost:5000 입력하면 미들웨어 실행
app.use('/', require('./routes/pages'))
// app.use(미들웨어) 형태면 모든 요청에서 미들웨어 실행
// app.use(/user', 미들웨어) 형태면 user로 시작하는
// 모든 요청에서 미들웨어 실행
// app.get(/user, 미들웨어) 형태면
// user로 시작하는 get 요청에서 미들웨어 실행

//===================================

//아래 app.get을 쓰지 않고, 위의 app.user로 대체 가능
// //index.hbs 파일을 보여줘라
// app.get("/", (req, res)=> {
//     // 단순히 문자를 출력하고 싶을 때 res.send를 썼다면
//     // html 파일을 출력하고 싶을 땐 render를 싸용한다.
//     res.render("index"); //index.hbs 이렇게 확장자명 안 쓰 게 주의
// });


// //내가 localhost:포트번호/register를 입력하면
// //register.hbs를 보여줘라
// app.get("/register", (req, res)=> {
//   res.render("register"); 
// });


app.use('/auth', require('./routes/auth'));



app.listen(8111, () => {
    console.log("Server is running...")
})