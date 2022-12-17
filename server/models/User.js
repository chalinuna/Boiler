const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const userSchema = mongoose.Schema({
    // 이름, 이메일, 비밀번호, 닉네임, 유저 권한, 토큰(로그인 상태 관리)
    name: {
        type:String,
        maxlength:50
    },    
    nikname: {
        type:String,
        maxlength: 50
    },
    email: {
        type:String,
        trim:true,
        unique: 1 
    },
    asonumber: {
        type:String,
        trim:true
    },
    password: {
        type: String,
        minglength: 5
    },
    role : {
        type:Number,
        default: 0 
    },
    image: {
        type:String
    },
    token : {
        type: String,
    },
    tokenExp :{
        type: Number
    }
})


// bcrypt를 이용한 비밀번호 암호화
// 'save'라는 api를 실행하기 전에 function를 실행하고, next로 save로 이동시킨다.
userSchema.pre('save', function( next ) {
    var user = this;
    
    if(user.isModified('password')){    
        console.log('비밀번호 변경중 ...')
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
            
            // hash화된 비밀번호 저장
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                console.log('여기까지 성공 ...')
                user.password = hash 
                next()
            })
        })
    } else {
        next()
    }
});

// 로그인 요청 시 비밀번호를 db에서 찾아 검증한다.
userSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

// 로그인 성공 시 토큰을 생성한다.
userSchema.methods.generateToken = function(cb) {

    var user = this;
    console.log('user',user)
    console.log('userSchema', userSchema)
    
    // 토큰을 생성한다.
    var token =  jwt.sign(user._id.toHexString(),'secret')
    var oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token;
    // 생성한 토큰과 함께 db에 저장한다.
    user.save(function (err, user){
        if(err) return cb(err)
        cb(null, user);
    })
}

// 토큰을 복호화한다.
userSchema.statics.findByToken = function (token, cb) {
    // 현재 유저 정보를 불러와,
    var user = this;

    // jwt를 사용해 decode(복호화) 한다.
    jwt.verify(token,'secret',function(err, decode){
        // 유저 아이디를 이용해 유저를 찾고 토큰을 전송하여 db에 있는 id와 토큰이 일치하는지 확인한다.
        user.findOne({"_id":decode, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }