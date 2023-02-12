//1. 사용자가 form 태그에 입력한 데이터를 출력

//2. 회원가입 페이지에서 사용자가 아이디 중복해서
//입력하진 않았는지, 페스워드 잘못 쓰진 않았는지 확인하는 곳


const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : '123',
    database : 'test1'
});


// 2. 로그인 페이지에서 사용자가 아이디나 비밀번호 입력하진 않았는지
// 혹은 잘못된 아이디와 비밀번호 입력하진 않았는지 확인하는 부분
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if( !email || !password){
            return res.status(400).render('login', {
                message: '이메일 혹은 비밀번호를 입력해 주세요.'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {


            if(results.length > 0){ //사용자가 있는지 ?

                bcrypt.compare(password, results[0].password, (err, result) => {  //비밀번화 맞는지?
                    if(result){
                        return res.render('login', {
                            message: "Loged in"
                        })
                    }else{
                        return res.render('login', {
                            message: "Wrong password"
                        })
                    }
                    
                });
    
            }
            else{
                return res.render('login', {
                    message: "Wrong email"
                })
            }
    
            // if( !results || !(bcrypt.compare(password, results[0].password) ) ) {
            //     res.status(401).render('login', {
            //         message: '이메일 혹은 비밀번호가 정확하지 않습니다.'
            //     })
            // } else {
            //     // const id = results[0].id;

            //     // const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            //     //     expiresIn: process.env.JWT_EXPIRES_IN
            //     // });

            //     // console.log("The token is: " + token);
            
            //     // const cookieOptions = {
            //     //     expires: new Date(
            //     //         Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 
            //     //     ),
            //     //     httpOnly: true
            //     // }

            //     // res.cookie('jwt', token, cookieOptions );
            //     res.status(200).redirect("/");
            // }
            
        })



    } catch (error){
        console.log(error);
    }
}

// 여기서 async을 사용하는 이유는 어떤 특정한 작업이 끝난 다음에
// 다음 작업으로 넘어가기 위해서 사용한다.
// 나는 A라는 작업이 모두 완료된 후에 B라는 작업으로
// 넘어갔으면 하는 데 Node.js는 A라는 작업을 하면서 동시에
// B라는 작업도 시작해 버리기 때문에 A 작업 끝나고,
// B라는 작업 시작해!라는 의미로 async를 사용한다.



//3. 회원가입 페이지에서 사용자가 아이디 중복해서
//입력하진 않았는지, 페스워드 잘못 쓰진 않았는지 확인하는 곳
exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) =>{
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if( password !== passwordConfirm ){
            return res.render('register', {
                message: 'Passwords do not match'
            });       
        }

        let hashePassword = await bcrypt.hash(password, 8);
        console.log(hashePassword);

        db.query('INSERT INTO users SET ? ', { name: name, email: email, password: hashePassword }, (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render('register', {
                        message: 'User registered'
                    })
                }
        })
    });

}

// req.body는 사용자가 form 태그를 통해 보낸 데이터를 의미한다.
// 예) 로그인 창에서 사용자가 이메일과 비밀번호를 입력할 경우 그 이메일과 비밀번호 데이터를 의미하게 된다.

// req.body.name은 register.hbs에 있는
// input 태그의 name을 가리킨다.


// const { name, email, password, passwordConfirm } = req.body;
//아래의 4줄을 축약해서 작성한 것이다.
// const name = req.body.name;
// const email = req.body.email;
// const password = req.body.password;
// const passwordConfirm = req.body.passwordConfirm;

//await는 기다려주다란 뜻이다.
//자바스크립트는 비동기라 동시에 코드 처리하는 데
// 동기 형태로 순차적으로 한 개씩 진행시켜주는 데 await를 사용
//비밀번호를 암호화할 때 시간이 좀 걸려서
// 비밀번호를 모두 암호화 한 다음에 다음으로 넘어가라~
//란 뜻으로 await 함수를 사용한다.

//hash 함수의 숫자 8은 암호화에 사용되는 Salt다.
// 값이 높을 수록 암호화 연산이 증가하나 암호화 속도는 느려짐
// 사용자가 입력한 비밀번호에 salt 즉 소금을 친다.
//이 소금친 걸 암호화해서 해킹을 막는다.

//res.send('tesing')을 쓴 이유가 hash 로 변한
// 비밀번호를 보기 위해서다. 이건 삭제함


// users SET ? ', { name: name })에서
// 첫번째 name은 users 속성의 name을 뜻하고,
// 두번째 name은 사용자가 from 태그에 입력한 name값을 의미



// !results 는 어떤 유저도 찾지 못할 때
// 즉 db에서 email 검색 해봤는 데 해당 email 보이지 않을 때

// bcrypt.compare의 첫 번째 매개변수는 
// 사용자가 입력한 비밀번호이고 두 번째 매개변수는
// results[0].password로 DB에서 검색한 users 데이터의 비밀번호를
// 넣어줘서 두 값을 비교하고 일치하면 true를 반환하고 일치하지 않으면 false를 반환하게 된다.

// results[0].password에서 results[0]은 email을 의미한다.
// results[0].password는 어떤 사람(이메일)의 패스워드를 의미

