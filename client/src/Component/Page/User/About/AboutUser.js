import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import { FormHelperText, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Stack } from "@mui/system";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Checkbox } from "antd";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { GET_USER } from "../../../../Store/setUser";


// < ---------------------------- HelockPW ---------------------------->

function HelpckPw() {
  return(
    <FormHelperText key="ckPw" style={{color:'red'}}>비밀번호가 서로 다릅니다.</FormHelperText>
  )
}

function UserPage(){

   let navigate = useNavigate()

    // < ---------------------------- get Redux ---------------------------->
    
    let redux = useSelector((state)=>{return state})
    const dispatch = useDispatch() 
    // < ---------------------------- State ---------------------------->

      // ----------useRef----------

      const imageInput = useRef();  

      // get File state
      const[files,setFiles] = useState('')
    
      //   미리보기 이미지
      const [imageSrc, setImageSrc] = useState('')
      

      // 업로드했는지
      const [isChagne,setChange] = useState(false)

      // < ---------------------------- set Values ---------------------------->

    const [values, setValues] = useState({
        email:redux.setUser.u_email,
        name:redux.setUser.u_name,
        nikname:redux.setUser.u_nik,
        password: '',
        ckpassword:'',
        showPassword: false,
        showPasswordTwo:false
      });

      // < ---------------------------- onChange Values ---------------------------->

      const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
      };

      const handleClickShowPassword = () => {
        setValues({
          ...values,
          showPassword: !values.showPassword,
        });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

      const handleClickShowPasswordTwo = () => {
        setValues({
          ...values,
          showPasswordTwo: !values.showPasswordTwo,
        });
      };

          
    const onClickInput = () => {
      imageInput.current.click();
      }   
    
      // 이미지 미리보기
    
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
              setChange(true)
              resolve();
            };
          });
    
      }  

      
     // < ---------------------------- CALL API ---------------------------->

     function CallUpdate() {

        if (isChagne){

        let formData = new FormData()
        const config = {
        header : {'content-type': 'multipart/form-data'}
        }
        // files[0]은 업로드된 파일의 정보를 담고 있다.
        formData.append("file",files[0])
        console.log(files)        
    
        axios.post('/api/user/uploadImgFolder', formData, config)
        .then(response=> {

        //성공했을 경우
        if(response.data.success) {
            console.log('사진 업로드 성공',response)
            // state에 이미지 url 저장
            let dbImg = response.data.url
            let body = {
                email:values.email,
                name:values.name,
                nikname:values.nikname,
                image:dbImg,
                password:values.ckpassword
              }
        
                axios.post('/api/user/update', body)
                  .then(response=>{console.log('회원정보 수정 완료',response.data) 
                //   redux셋팅
                  dispatch(GET_USER({email:values.email, name:values.name, nikname:values.nikname, role:redux.setUser.u_role,image:dbImg}))
            
            
                    navigate('/')
                  // eslint-disable-next-line no-restricted-globals
                location.reload()
              })
        } else {
        alert('프로필사진 업로드를 실패했습니다.')
          }
        })
        // 이미지를 수정하지 않을 경우
        } else {
         
            let dbImg = redux.setUser.u_image
            let body = {
                email:values.email,
                name:values.name,
                nikname:values.nikname,
                image:dbImg,
                password:values.ckpassword
              }
        
                axios.post('/api/user/update', body)
                  .then(response=>{console.log('회원정보 수정 완료',response.data) 
                //   redux셋팅
                  dispatch(GET_USER({email:values.email, name:values.name, nikname:values.nikname, role:redux.setUser.u_role,image:dbImg}))
            
            
                    navigate('/')
                  // eslint-disable-next-line no-restricted-globals
                location.reload()
              })       
          
        }
        

      
     }

     
    let str = ''
    let test = ''

     if(redux.setUser.u_image == 'http://localhost:3000/avatar.jpg'){
        
        test='http://localhost:3000/avatar.jpg'
    } else {
      let copy = redux.setUser.u_image
      str = copy.substring(14)
      test = 'http://localhost:3000/'+str

    }

    

    const [hoverOpa,setOpa] = useState(1)


      // < ---------------------------- UI ---------------------------->

    return(
      <div style={{width:'100%',height:'90vh', display:'flex'}}>
      <div style={{display:'flex',width:'700px', margin:'auto', border:'1px solid gray', borderRadius:'19px'}}>
       <div style={{margin:'auto'}}>
          <Stack style={{marginBottom:'50px', width:'350px'}} direction="column" justifyContent="center" alignItems="center" spacing={2} >
         
          <h3 style={{textAlign:'center', fontWeight:'bold', marginTop:'50px'}}>마이페이지</h3>
        
          <FormControl variant="standard" style={{margin:'0', marginTop:'30px'}}>
          
          <div>
            
              <img
              onMouseOver={()=>setOpa(0.5)}
              onMouseOut={()=>{setOpa(1)}}
              className="uploadImage"
              style={{width:'120px',height:'120px', borderRadius:'50%',border:'2px solid lightgray',
              alignItems:'center', justifyContent:'center', cursor:'pointer', opacity:hoverOpa}}
              onClick={onClickInput}
              alt='프로필 이미지'
              
              src={imageSrc? imageSrc : test}/>

            <input type="file" 
              style={{display:'none'}} 
              
              onChange={onLoadFile} 
              ref={imageInput} />
          </div>     


          </FormControl>
          <FormControl style={{marginTop:'40px'}} variant="standard">
                      <InputLabel htmlFor="component-helper">이메일</InputLabel>
                      <Input
                      id="component-helper"
                      value={values.email}
                      onChange={handleChange('email')}
                      aria-describedby="component-helper-text"
                      readOnly
                      endAdornment={
                        <InputAdornment position="end">
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </InputAdornment>  }/>              
            </FormControl>           

          <FormControl variant="standard">
                      <InputLabel htmlFor="component-helper">이름</InputLabel>
                      <Input
                      id="component-helper"
                      value={values.name}
                      onChange={handleChange('name')}
                      aria-describedby="component-helper-text"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton><ModeEditIcon/>
                          </IconButton>
                        </InputAdornment>  }/>              
            </FormControl>
            <FormControl variant="standard">
            <InputLabel htmlFor="component-helper">닉네임</InputLabel>
                      <Input
                      id="component-helper"
                      value={values.nikname}
                      onChange={handleChange('nikname')}
                      aria-describedby="component-helper-text"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton><ModeEditIcon/>
                          </IconButton>
                        </InputAdornment>  }/> 
            </FormControl>
            <FormControl variant="standard" >
            <InputLabel htmlFor="standard-adornment-password">비밀번호 변경</InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={values.showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
            </FormControl>
            <FormControl variant="standard">
            <InputLabel htmlFor="standard-adornment-password">비밀번호 재입력</InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={values.showPasswordTwo ? 'text' : 'password'}
                  value={values.ckpassword}
                  onChange={handleChange('ckpassword')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordTwo}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPasswordTwo ? <VisibilityOff /> : <Visibility />}
                      </IconButton>                     
                    </InputAdornment>
                  }
                />             
              {(values.password != values.ckpassword) ? <HelpckPw/> : <></> }

            </FormControl>   
            <FormControl variant="standard">
            <Checkbox style={{fontSize:'13px'}}>마케팅 수신동의 <span style={{fontSize:'10px'}}>홍보 이메일을 수신합니다.</span> </Checkbox>
            </FormControl>  
            <Container>  
            <Row style={{marginTop:'30px'}} >
              <Col style={{fontWeight:'bold', color:'gray', cursor:'Pointer'}}>회원 탈퇴</Col>
              <Col style={{fontWeight:'bold', color:'black', cursor:'Pointer', marginLeft:'90px'}}
              onClick={CallUpdate}              
              >변경사항 저장</Col>
            </Row> 
            </Container>

            </Stack>
            </div>
     </div>
   </div>

        )

}
export default UserPage