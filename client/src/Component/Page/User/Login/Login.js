import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login(props){

  
 let sessionStorage = window.sessionStorage;

// < ---------------------------- 페이지 이동 Hook ---------------------------->

  let navigate = useNavigate()  
  
  // < ----------------------------입력된 값 받아오기 ---------------------------->
  
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [saveLogin, setSave] = useState(true)

  function getEmail(e) {
    setUserEmail(e.target.value)
    console.log(userEmail)
  }

  function getPassword(e) {
    setUserPassword(e.target.value)
    console.log(userPassword)
  }

  function getSave() {
    setSave(!saveLogin)
    console.log(saveLogin)
  }

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  // < ----------------------------로그인 핸들러 ---------------------------->
  // < ----------------------------백엔드 api 호출 ---------------------------->

  function doLogin() {

      let body = {
        email:userEmail,
        password:userPassword,
        saveLogin:saveLogin
      }

      if (userEmail.length===0) {
        alert('아이디를 입력해주세요.')
      } else if (userPassword. length === 0) {
        alert('비밀번호를 입력해주세요')
      } else {

      axios.post('/api/user/login',body)
      .then(response => {console.log('로그인 정보 전송함..', response)          
     
      // 로그인 성공했을 경우
       if(response.data.loginSuccess===true) {
         if(saveLogin) {
        
        // 로그인 저장 시 메인으로 이동

        navigate('/')
        // eslint-disable-next-line no-restricted-globals
        location.reload()
        // 로그인 비저장 시 세션스토리지에 저장
      } else if (!saveLogin) {
        console.log('브라우저 종료 시 로그아웃됨')
        sessionStorage.setItem("w_authExp", response.data.w_authExp)
        sessionStorage.setItem("w_auth",response.data.w_auth)
        console.log('세션에저장된Exp',sessionStorage.getItem('w_authExp'))
        console.log('세션에저장된w_auth',sessionStorage.getItem('w_auth'))
        
        navigate('/')
        // eslint-disable-next-line no-restricted-globals
        location.reload()
       }
      // 로그인 실패할 경우 알림창 출력
      } else if (response.data.loginSuccess === false) {
         alert('이메일 또는 비밀번호가 올바르지 않습니다.')
       }
    })
  }

  } 

  // 만일 이미 로그인 한 상태라면, 로그인 ui를 보여주지 않고 LandingPage로 이동시킨다.
  if (props.isAuth) {
    navigate('/')
  } else {
  return (
      <div style={{width:'100%',height:'90vh',display:'flex'}}>
        <div style={{display:'flex',width:'900px', margin:'auto', border:'1px solid gray', borderRadius:'19px'}}>
      
          <Form style={{ margin: 'auto', marginTop:'150px', marginBottom:'150px'}}
            name="normal_login"
            className="login-form"
            size='large'
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
                <h2 style={{textAlign:'center', fontWeight:'bold', marginBottom:'30px'}}>로그인</h2>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: '아이디를 입력해주세요',
                  },
                ]}
              >
                <Input 
                
                onChange={(e)=>{getEmail(e)}}
                className='usernameInput' 
                style={{fontSize:'15px'}} 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="Username" />

              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: '비밀번호를 입력해주세요',
                  },
                ]}
              >
                <Input
                  onChange={(e)=>{getPassword(e)}}
                  style={{fontSize:'15px'}}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox onClick={getSave} >로그인 유지하기</Checkbox>
                </Form.Item>

                <span className="login-form-forgot" style={{float:'right',cursor:'Pointer'}}>
                  아이디 / 비밀번호 찾기
                </span>
              </Form.Item>
              <Form.Item>
                  <span style={{cursor:'Pointer'}} onClick={()=>{navigate('/register')}} > 회원가입 </span>
                <Button size="middle" type="primary" htmlType="submit" className="login-form-button" style={{float:'right', backgroundColor:'#040341'}}
                onClick={()=>{ 
                  doLogin()
                }
                }>로그인</Button>
              </Form.Item>
                <Button style={{width:'100%', height:'40px',backgroundColor:'#03C75A',color:'white', margin:'0'}}>네이버 로그인</Button>
                <Button style={{width:'100%', height:'40px',backgroundColor:'yellow',color:'black', marginTop:'10px'}}>카카오 로그인</Button>
            
          </Form>
    </div>
    
    </div>
  );
  }
};
export default Login;