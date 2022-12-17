import React, { useEffect, useState } from "react";
import ReactQuill, { Quill } from 'react-quill';
import Button from 'react-bootstrap/Button';
import 'react-quill/dist/quill.snow.css';

import ImageResize from 'quill-image-resize';
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

Quill.register('modules/ImageResize', ImageResize);


function Edit(){    

    let params = useParams()
    let postId = params.postId

    let navigate = useNavigate()
    // ------------------------State------------------------
    // 리덕스에 _id저장해서 _id받아오기
    let redux = useSelector((state)=>{return state})

    

    // category의 경우, api에서 건네받는다. 기본값은 notice.
    let category = ''    
      
    let location = useLocation()

    category = location.state.category
    let doc = location.state.doc
    
    const [subject, setSubject] = useState(doc.subject)
    const [content, setContent] = useState(doc.content)   
   
    // ------------------------get Content------------------------

    const onChagecontent = (e) => {
        setContent(e)
    }
    
    // ------------------------정규식으로 src 추출------------------------ 
   
    // src만 추출
    const srcArray = []
    // blopArray로 변환
    const blopArray = []

    // 최종 src url 저장할곳
    const urlArray = []

    const gainSource = /(<img[^>]*src\s*=\s*[\"']?([^>\"']+)[\"']?[^>]*>)/g

    async function SaveBoard() {


        // 원래 사진을 서버에서 삭제하라.

        
        // 이미지가 있을때만 아래 코드 실행(while)
              // 이미지 처리
                // 정규식으로 추출하여 배열에 저장
                while(gainSource.test(content)){
                    console.log('이미지가 있을때만 진행함.')
                    let result = RegExp.$2
                    // console.log('src 추출 결과 : ',result)
                    srcArray.push(result)
                    console.log('srcArray 추가: ',srcArray)

                    let isbase64 = result.includes('base64')
                    console.log('isabase64:', isbase64)


                    // 만일 업로드한 파일 중 isbase64가 있으면 아래 과정을 실행한다.
                    // 파일을 blop으로 바꾸고, formdata에 넣어서, 서버에 저장하는 과정
                    if (isbase64) {
                    // base64파일 Blop으로 바꾸기

                     // // dataURL 값이 data:image/jpeg:base64,~~~~~~~ 이므로 ','를 기점으로 잘라서 ~~~~~인 부분만 다시 인코딩
                    const byteString = atob(result.split(",")[1]);

                    // Blob를 구성하기 위한 준비
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    const blob = new Blob([ia], {
                        type: "image/jpeg"
                    });
                    const file = new File([blob], "image.jpg");

                    // 위 과정을 통해 만든 image폼을 FormData에 넣어줍니다.
                    // 서버에서는 이미지를 받을 때, FormData가 아니면 받지 않도록 세팅해야합니다.
                    const formData = new FormData();
                    formData.append("file", file);   
                    console.log('formData: ',formData)                 


                    // 백엔드로 보내서 urlArray에 돌려받은 url을 배열 형태로 push 해준다. 
                    // 최상단 while문이 모든 사진을 추출해 하나씩 저장하여 push하므로 
                    // 백엔드의 multer 패키지에 single로 저장을 요청한다.

                    const config = {
                        header : {'content-type': 'multipart/form-data'}
                        }

                     // TODO FormData 백엔드로 넘겨서 url 건네받아 저장하고, url 반환해서 urlArray에 저장하기

                    await axios.post('/api/board/uploadImgFolder',formData, config )
                    .then(response => {
                        if(response.data.success) {
                            console.log('이미지 서버에 업로드 성공', response)                            
                            
                            let test = response.data.url
                            let copy = 'http://localhost:3000/' + test.substring(14)
                            urlArray.push(copy)

                            console.log('urlArray에 추가',urlArray)
                        } else {
                            console.log(response)
                            alert('이미지를 서버에 업로드하는데에 실패했습니다.')
                        }
                    })
                    
                    // FormData의 key 확인
                        for (let key of formData.keys()) {
                            console.log('key',key);
                        }
                        
                        // FormData의 value 확인
                        for (let value of formData.values()) {
                            console.log('value',value);
                        } 
                      
                        //   
                    }  else { //업로드한 파일 중 이미 서버에 저장된 내용이 있으면, 그 내용을 유지하기 위해서 어레이에 넣어준다.
                        urlArray.push(result)
                    }           

                }
                                
                
                //  게시글 내용 지정하기

                console.log('서버 주소 저장된 어레이: ',urlArray)

                let endContent = content
               
                 // 만일 이미지를 업로드 했다면, 첫번쨰 srcArray가 있는 부분을 첫번째 url로 바꾸는 식으로 계속 바꿔라.
                if(srcArray.length > 0) {   
                    console.log('실행은 됐음..')             
                    for(let i = 0; i<srcArray.length; i++) {
                        console.log('실행중.. '+i+' 번째임')
                        console.log('srcArray[i]: ',srcArray[i],'urlArray[i]: ',urlArray[i])
                        let replace = endContent.replace(srcArray[i],urlArray[i])
                        endContent = replace
                        console.log('바뀌었는지 테스트',endContent)
                    } 
                } // 없다면 content=content

                console.log('endContent:',endContent)                
                    
                // 카테고리, 제목, 글쓴이, 컨텐츠 내용 백엔드에 보내 수정하기
                               
                let writeInform = {                    
                    postId:postId,
                    category: category,
                    subject: subject,
                    content: endContent,
                    writer:redux.setUser.u_id,
                    imgList:urlArray,
                }      

                axios.post('/api/board/update', writeInform)
                .then(response => {
                    if(response.data.success) {
                        console.log('수정 성공')
                        console.log('수정한 데이터 : ',response)
                    } else {
                        alert('업로드에 실패하였습니다.')
                    }
                
                })

                
        navigate('/')
        // eslint-disable-next-line no-restricted-globals
        location.reload()
        
    }



    // ------------------------quill Modules------------------------
    const modules = {
        toolbar: [
            [{ 'font': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
           

  
            ['bold', 'italic', 'underline', 'strike','blockquote', 'code-block'],        // toggled buttons
            ['link','image'],
            
            [{ 'align': [] },{ 'color': [] },{ 'background': [] }],       // dropdown with defaults from theme
            
          
          
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
         
          ],
          ImageResize: {
            parchment: Quill.import('parchment')
        }
    }

    let isAuth = redux.setToken.authenticated

    useEffect(()=>{
        if (!isAuth) {            
                navigate('/')            
        }
    })




    // ------------------------UI------------------------

    
    return(
        <div>
             <div style={{width:'100%', height:'90vh'}}>
                 <div style={{width:'1000px', margin:'auto', borderRadius:'19px'}}>

                     <div style={{marginBottom:'20px',marginTop:'70px', fontSize:'20px', fontWeight:'bold'}} >공지사항</div>

                    {/* ======== Subject ======== */}
                    
                    <input
                    className="Subject"
                    value={subject}
                    style={{padding:'7px', marginBottom:'10px',width:'100%',border:'1px solid lightGray', fontSize:'15px'}}
                    onChange={(e)=>{setSubject(e.target.value)}}

                    ></input>      
                    
                    <div style={{height:'650px'}}>
                    
                    {/* ======== Quill ======== */}

                    <ReactQuill                     
                    modules={modules} 
                    value={content}
                    placeholder='내용을 입력해 주세요'
                    onChange={onChagecontent}
                    style={{height: "600px"}} 
                    />         
                    </div>        

                    {/* ======== Button ======== */}

                    <div style={{float:'right'}}>
                    <Button variant="danger" style={{marginRight:'10px'}} >취소</Button>
                    <Button variant="dark"
                    onClick={()=>{
                        SaveBoard()
                    }}
                    >저장하기</Button>
                    </div>                                    
                </div>          
                </div>                
        </div>
    )
                
    
}

export default Edit