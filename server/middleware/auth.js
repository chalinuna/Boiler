const { User } = require('../models/User');

let auth = (req, res, next) => {
  
  let token = req.cookies.w_auth;
  
  // 클라이언트 쿠키, 또는 세션에서 토큰을 가져온다.
  req.cookies.w_auth ? token = req.cookies.w_auth : token = req.body.w_auth
  console.log('토큰출력',token)    

  // 유저를 찾기 위해 토큰을 복호화한다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    // 만일 유저가 없으면 false를 반환
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });

      // 만일 유저를 찾으면 토큰과 유저를 저장해 클라이언트로 전송한다.
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
