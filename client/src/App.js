import {useEffect, useMemo, useState} from 'react'
import axios from 'axios'
import { Routes, Route } from 'react-router-dom'
import Login from './Component/Page/User/Login/Login';
import AboutUser from './Component/Page/User/About/AboutUser';
import Combinebar from './Component/Appbar/Combinebar';
import LandingPage from './Component/Page/Main/LandingPage';
import { useDispatch, useSelector } from 'react-redux';
import Register from './Component/Page/User/Register/Register';
import store from './Store/store';
import { GET_TOKEN } from './Store/setToken';
import { GET_USER } from './Store/setUser';
import { Cookies } from 'react-cookie';
import Write from './Component/Board/Write/Write';
import Posts from './Component/Page/Board/Posts';
import Content from './Component/Page/Board/Content';
import Edit from './Component/Board/Edit/Edit';

function App() {


  let sessionStorage = window.sessionStorage;
  let body = {
    w_auth : sessionStorage.getItem('w_auth'),
    w_authExp : sessionStorage.getItem('w_authExp')
  }

  //<------------------------ User state ------------------------>

  const [isAuth, setAuth] = useState(false)
  const [userNikname, setNikname] = useState('') 
  let category = {
    notice:'notice'
  }

  //<------------------------ Redux ------------------------>

  let Rstore = useSelector((state)=>{return state})
  let dispatch = useDispatch()

  //<------------------------ Cookie ------------------------>

  const cookies = new Cookies()

  //<------------------------ auth User ------------------------>

  useEffect( ()=>{    
    // 현재 user상태를 가져온다.
    axios.post('/api/user/auth',body)
    .then(response => {
        console.log('App.js => auth정보',response.data)
        // 만일 로그인 된 상태면
        if(response.data.isAuth === true){
        console.log('리스폰스 데이터',response.data)

        // Redux에 쿠키에 저장된 토큰을 받아와 할당하라
        dispatch(GET_TOKEN(cookies.get('w_auth')))

        // res로 받아온 정보를 GET_USER에 할당하라
        dispatch(GET_USER({_id:response.data._id,email:response.data.email, name:response.data.name, nikname:response.data.nikname, role:response.data.role, image:response.data.image}))

        // state에 값을 할당한다.
        setAuth(true)
        setNikname(response.data.nikname)  
      }
        else {
          // 만일 유저가 없으면(로그인하지 않은 상태라면)
        }
      })
  },[])   

  console.log(Rstore)

  
// isAuth가 true면, userRole의 결과에 따라,
// 관리자용 페이지를 보여주거나, 일반 유저용 페이지를 보여주고,
// 로그인 및 회원가입 사이트로의 진입을 막는다.
      return ( 
   
      <div>       
        
        <Combinebar isAuth={isAuth} userNikname={userNikname}></Combinebar>
        
        <Routes>         
          <Route path="/" element={<LandingPage></LandingPage>}/>
          <Route path="/login" element={ <Login isAuth={isAuth}></Login> } />
          <Route path="/register" element={ <Register isAuth={isAuth}></Register> } />
          <Route path="/user/about" element={ <AboutUser isAuth={isAuth} ></AboutUser> }/>
          <Route path='/notice' element={<Posts category={category.notice} ></Posts>}/>
          <Route path='/:postId' element={<Content></Content>}/>
          <Route path='/write' element={<Write></Write>}/>
          <Route path='/edit/:postId' element={<Edit></Edit>}/>
        </Routes>
        
    </div>
    );

}

export default App;
