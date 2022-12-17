const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require("path");
// -------------------------------------------------------
const { auth } = require('../middleware/auth')
const { Board } = require('../models/Board');
// -------------------------------------------------------


// ===================

// 글쓰기

// ===================
router.post('/write', function(req,res){

    const board = new Board(req.body)

    board.save((err,boardInfo) => {
        if(err) return res.json({success:true,err})
        return res.status(200).json({
            success:true, boardInfo:boardInfo
        })
    })
})


// ===================

// 이미지 업로드하기

// ===================

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
           || file.mimetype == "image/jpeg"
           || file.mimetype == "image/gif"){
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png .jpg .gif and .jpeg format allowed!'));
        }
    }
});

const upload = multer({storage:storage}).single("file")

router.post('/uploadImgFolder', (req,res)=>{
    upload(req,res,err=> {
        if(err){
            return res.json({success:false, inText:'업로드 과정에서의 에러', err:err})
        }
        return res.json({success:true, inText:"폴더에 업로드 성공", url:res.req.file.path, fileName:res.req.file.filename})
    })

})



// ===================

// 글 목록 불러오기

// ===================

router.post('/getBoard', (req,res)=> {
    // 카테고리에 해당하는 글을 찾아라
    Board.find({category:req.body.category})
    .populate('writer')
    .sort({'createdAt':-1})
    .exec((err,boards) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true,boards:boards})
    })
}
)

// ===================

// 글 상세페이지 불러오기

// ===================

router.post('/getContent', function(req,res){
    Board.findOne({$and : [{category:req.body.category},{_id:req.body.postId}]}, (err,doc)=> {
        if(!doc) return res.json({success:false,message:'게시물을 찾지 못했습니다.'})
        return res.json({success:true, doc:doc})
    })
   
})

// ===================

// 글 수정하기

// ===================


router.post('/update', function(req,res){

    Board.findOneAndUpdate({_id:req.body.postId},
        {category:req.body.category,
         subject:req.body.subject,
         content:req.body.content,
         imgList:req.body.imgList   
    },(err,doc)=> {
        if(err) return res.json({success:false,err:err})
        return res.status(200).send({
            success:true,massage:'수정 성공',doc:doc
        })
    })

       
})

// ===================

// 글 삭제하기

// ===================

router.post('/deletePost',function(req,res){
    console.log(req.body._id)
    Board.deleteOne({_id:req.body._id})
    .exec((err,result) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true,result:result})
    })
})



module.exports = router