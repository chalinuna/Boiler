const express = require('express')
const router = express.Router()
const multer = require('multer')
const {v4} = require('uuid')
// -------------------------------------------------------
const { auth } = require('../middleware/auth')
const { User } = require('../models/User');
// -------------------------------------------------------

router.post('/register', function(req,res){

    // 받아온 정보를 user에 저장한다.
    const user = new User(req.body)
    // 여기서 userSchema.pre('save', function( next ) { 를 실행시킨다.

    user.save((err, userInfo) => {
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    })
})

router.post("/login", (req, res) => {

    let saveLogin = req.body.saveLogin
    console.log('/login에서 받은 saveLogin',saveLogin)

    // 로그인 요청한 이메일을 db에서 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

            // 이메일이 db에 있다면 비밀번호를 찾아 검증한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });
            // 로그인에 성공하면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                // 만일 saveLogin이 true라면
                // 토큰을 바로 쿠키에 저장한다.
                else if(saveLogin) 
                { console.log('로그인 성공')
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id, userRole: user.role
                    });
                }
                // 만일 saveLogin이 false라면
                // 토큰을 프론트로 전달해 프론트에서 세션에 저장한다.
                else if(!saveLogin) 
                { console.log('로그인 성공')
                res
                    .status(200)
                    .json({
                        loginSuccess: true, w_authExp: user.tokenExp, w_auth: user.token
                    });
                }
            });
        });
    });
});

// 유저 인증 처리
// auth.js로 요청을 포워딩해 쿠키에서 생성된 토큰과, db에 저장된 토큰을 비교한다.
router.post("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        nikname: req.user.nikname,
        role: req.user.role,
        image: req.user.image,
    });    
    console.log('유저 토큰 찾기 성공')
});

// 로그아웃
// db에 있는 토큰을 지워 유저 인증 절차가 통하지 않도록 만드는 원리

router.post("/logout", auth, (req, res) => {
    // middleware의 auth.js에서 _id를 가져와 해당하는 유저의 토큰을 삭제한다.
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post('/update', function(req,res){

    // 비밀번호를 변경하지 않는 경우
    if(req.body.password === '') {
        User.findOneAndUpdate({ email:req.body.email }, {nikname:req.body.nikname, name:req.body.name, image:req.body.image}, (err, doc) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true, noPasswordChange:true
            });
        });
    } else {
    // 비밀번호를 변경하는 경우
        User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "정보를 찾지 못했습니다."
            });} else if (user) {

                // client에서 받아온 정보로 변경할 정보 set
                user.name=req.body.name
                user.nikname=req.body.nikname
                user.image = req.body.image
                user.password=req.body.password
                
                // save 호출 위해 User set
                const userUpdate = new User(user)

                // Update 위해 save 호출
                // ========= User.js => userSchema.pre('save', function( next ) { bcrypt Password } =========

                userUpdate.save((err, userInfo) => {
                if(err) return res.json({success:false, err})
                return res.status(200).json({
                    success:true, save:'저장에 성공하였습니다.',userInfo:userInfo
                })
            })} 
        })
    }
})


const storage = multer.diskStorage({
    // 받아온 file을 두번째 인자로 주어진 경로에 저장한다.
    destination: (req, file, cb) => {
        cb(null, "./client/public")
    },
    // 저장할 파일의 이름을 설정한다.
    filename: (req, file, cb) => {        
        cb(null, `${Date.now()}_${file.originalname}`);       
        // 또는 const fileName = file.originalname.toLowerCase().split(' ').join('-');
        // cb(null, v4() + '-' + fileName)
      // (uuidv4 O) 7c7c98c7-1d46-4305-ba3c-f2dc305e16b0-통지서
      // (uuidv4 X) 통지서
    },
    fileFilter: (req, file, cb) => {
        // 파일 확장자를 출력하여 검사한다.
        const ext = path.extname(file.originalname)
        if(ext == "image/png" 
           || file.mimetype == "image/jpg" 
           || file.mimetype == "image/jpeg"){
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png .jpg and .jpeg format allowed!'));
        }
    }
});


// let uploadImage = multer({
//     storage: storage,
//     // 허용할 file의 유형들을 지정한다.
//     fileFilter: (req, file, cb) => {
//         if(file.mimetype == "image/png" 
//            || file.mimetype == "image/jpg" 
//            || file.mimetype == "image/jpeg"){
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error('Only .png .jpg and .jpeg format allowed!'));
//         }
//     }
// });

const upload = multer({storage:storage}).single("file")


router.post('/uploadImgFolder', (req,res)=>{
    upload(req,res,err=> {
        if(err){
            return res.json({success:false, inText:'업로드 과정에서의 에러'})
        }
        return res.json({success:true,inText:"폴더에 업로드 성공", url:res.req.file.path, fileName:res.req.file.filename})
    })

})


module.exports = router