import React, { useState } from 'react';
import { LockOutlined, UserOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FormHelperText } from '@mui/material';


function HelpText(Helptext) {
    return(
      <FormHelperText key="ckPw" style={{color:'red'}}>{Helptext}</FormHelperText>
    )
} 

const Register = (props) => {
  

  let navigate = useNavigate()

  // < ----------------------------입력된 값 받아오기 ---------------------------->

  const [username, setUserName] = useState()
  const [userNikname, setUserNikname] = useState()
  const [userEmail, setUserEmail] = useState()
  const [userAut, setAut] = useState()
  const [userPassword, setPassword] = useState()
  const [Checkpassword,setCheckPsw] = useState()


  function getName(e) {
    setUserName(e.target.value)
    console.log(username)
  }

  function getNikname(e) {
    setUserNikname(e.target.value)
    console.log(userNikname)
  }
  function getUserEmail(e) {
    setUserEmail(e.target.value)
    console.log(userEmail)
  }
  function getAut(e) {
    setAut(e.target.value)
    console.log(userAut)
  }
  function getPassword(e) {
    setPassword(e.target.value)
    console.log(userPassword)
  }
  function checkPsw(e) {
    setCheckPsw(e.target.value)
    console.log(Checkpassword)
  }

  let Helptext = {
    IName : '이름을 입력해 주세요.',
    INik: '닉네임을 입력해 주세요.',
    IEmail: '이메일을 입력해주세요.',
    IAuth: '인증번호를 입력해주세요.',
    IPwd: '비밀번호를 입력해주세요.',
    IckPwd:'비밀번호가 서로 다릅니다.'
}

  // < ---------------------------- 백엔드 api 호출 ---------------------------->
  function onRegister() {

    let body = {
      name:username,
      nikname:userNikname,
      email:userEmail,
      asonumber:userAut,
      password:userPassword,
      image:'http://localhost:3000/avatar.jpg'
    }

    if( !username || !userNikname || !userEmail || !userAut || !userPassword ) {
      alert('작성하지 않은 항목이 있습니다.')
    } else if (Checkpassword!=userPassword) {
      alert('비밀번호가 같지 않습니다.')
      
    } else {      
    axios.post('/api/user/register', body)
    .then(response=>{console.log('회원가입 완료',response)
    navigate('/')
    // eslint-disable-next-line no-restricted-globals
   location.reload()})
    }
  }

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

// < ----------------------------로그인 되어있을 경우 navigate('/') ---------------------------->
  if (props.isAuth) {
    navigate('/')
// < ---------------------------- 아닐 경우 회원가입 UI VIEW ---------------------------->
  } else {
  return (
      <div style={{width:'100%',height:'100vh',display:'flex', marginTop:'40px', marginBottom:'40px'}}>
        <div style={{ display:'flex',width:'900px', height:'100vh', margin:'auto', border:'1px solid gray', borderRadius:'19px'}}>
      
    <Form style={{ margin: 'auto', width:'280px'}}
      name="normal_Register"
      className="register-form"
      size='large'
      initialValues={{
        remember: false,
      }}
      onFinish={onFinish}
    >
        <h2 style={{textAlign:'center', fontWeight:'bold', paddingBottom:'20px' }}>회원가입</h2>
        <Form.Item
        name="userName">
        <Input style={{fontSize:'15px'}} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="이름" 
        onChange={(e)=>{getName(e)}}
        />
          {(!username) ? HelpText(Helptext.IName) : <></> }
      </Form.Item>
      <Form.Item
        name="userNikname">
        <Input style={{fontSize:'15px'}} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="닉네임" 
        onChange={(e)=>{getNikname(e)}}/>
        {(!userNikname) ? HelpText(Helptext.INik) : <></> }
      </Form.Item>
      <Form.Item
        name="userId">
        <Input style={{fontSize:'15px', float:'left'}} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" 
        onChange={(e)=>{getUserEmail(e)}}/>     
        {(!userEmail) ? HelpText(Helptext.IEmail) : <></> }
        <Button disabled="" size="middle" type="primary" htmlType="submit" className="login-form-button" style={{backgroundColor:'gray', width:'100%', marginTop:'10px'}}
        >
         
          인증번호 발송
        </Button>        
      </Form.Item>
      <Form.Item
        name="EmailCheck">
        <Input style={{fontSize:'15px'}} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="인증번호" 
        onChange={(e)=>{getAut(e)}}/>
        {(!userAut) ? HelpText(Helptext.IAuth) : <></> }
      </Form.Item>
      <Form.Item
        name="password">
        <Input
        style={{fontSize:'15px'}}
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="비밀번호"
          onChange={(e)=>{checkPsw(e)}}          
        />
        {(!userPassword) ? HelpText(Helptext.IPwd) : <></> }
      </Form.Item>
      <Form.Item
        name="Checkpassword">
        <Input
        style={{fontSize:'15px'}}
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="비밀번호"
          onChange={(e)=>{getPassword(e)}         
        }
        />
        {(userPassword!=Checkpassword) ? HelpText(Helptext.IckPwd) : <></> }
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox style={{marginTop:'10px'}}>전체 동의하기</Checkbox>
          <div>&nbsp;&nbsp;&nbsp;<span><CheckOutlined style={{color:'gray'}}/>&nbsp;</span> 서비스 이용 약관 동의 (필수)</div>
          <div>&nbsp;&nbsp;&nbsp;<span><CheckOutlined style={{color:'gray'}}/>&nbsp;</span> 개인정보 수집 및 이용 동의 (필수)</div>
          <div>&nbsp;&nbsp;&nbsp;<span><CheckOutlined style={{color:'gray'}}/>&nbsp;</span> 마케팅 수신 동의 (선택)</div>
        </Form.Item>
       
      </Form.Item>
      <Form.Item>
      
        <Button size="large" type="primary" htmlType="submit" className="login-form-button" 
        style={{width:'100%', backgroundColor:'gray'}}
        onClick={()=>{
          onRegister()
         
        }}>
          회원가입
        </Button>
      </Form.Item>      
    </Form>
    </div>
    
    </div>
  );
}
};
export default Register;