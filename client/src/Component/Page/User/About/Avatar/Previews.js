import axios from "axios";
import React, { useEffect, useRef, useState } from "react";


function Previews() {

  const imageInput = useRef();  

  const[files,setFiles] = useState('')
  const [imageSrc, setImageSrc] = useState('');

  const [userImg,setImg] = useState('')

  
const onClickInput = () => {
  imageInput.current.click();
  }   


  const onLoadFile = (e) => {

    const file = e.target.files;
    console.log('onLoadFile',file)
    setFiles(file);
    console.log('state에 저장 완료 files',files)

    let fileBlob = e.target.files[0]
    
      const reader = new FileReader();
      reader.readAsDataURL(fileBlob);
      return new Promise((resolve) => {
        reader.onload = () => {
          setImageSrc(reader.result);
          resolve();
        };
      });

  }
  
  function saveImage() {

    let formData = new FormData
    const config = {
      header : {'content-type': 'multipart/form-data'}
    }

    // files[0]은 업로드된 파일의 정보를 담고 있다.
    formData.append("file",files[0])
    console.log('append했음',files[0])

      axios.post('/api/user/uploadImgFolder', formData, config)
    .then(response=> {
      //성공했을 경우
      if(response.data.success) {
        console.log('사진 업로드 성공',response)
        setImg(response.data.url)            
      } else {
        alert('프로필사진 업로드를 실패했습니다.')
      }
    })

  }


  return(
    <div>
      <input type="file" 
      style={{display:'none'}} 
      
      onChange={onLoadFile} 
      ref={imageInput} />
     <img

     className="uploadImage"
     style={{width:'120px',height:'120px', borderRadius:'50%',border:'2px solid lightgray',
     alignItems:'center', justifyContent:'center', cursor:'pointer',backgroundColor:'white'}}
     onClick={onClickInput}
     
     src={imageSrc? imageSrc : ''}

     >

     </img>

     <button onClick={saveImage}>저장 테스트</button>


    </div>
  )
}

  export default Previews;