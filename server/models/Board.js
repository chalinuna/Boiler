const mongoose = require('mongoose');
const Schema = mongoose.Schema
const moment = require('moment');

const boardSchema = mongoose.Schema({
    // 이름, 이메일, 비밀번호, 닉네임, 유저 권한, 토큰(로그인 상태 관리)
    category: {
        type:String,
        trim:true,
        required: true,
    },  
    subject: {
        type:String,
        maxlength: 50,
        required: true,
    },
    content: {
        type:String,
        required: true,
    },
    writer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    imgList: {
        type:[String]
    },
    view: {
        type: Number,
        default: 0
    },
    good : {
        type:Number,
        default: 0 
    },   
    createdAt: {
        type:Date,
        default:Date.now()
    }
})

const Board = mongoose.model('Board', boardSchema);

module.exports = { Board }

