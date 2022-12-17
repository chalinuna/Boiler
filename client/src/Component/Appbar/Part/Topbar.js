import React from 'react';
import {useNavigate } from 'react-router-dom'
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import GetAvatar from '../../Page/User/About/Avatar/GetAvatar';
import { DELETE_TOKEN } from '../../../Store/setToken';
import { DELETE_USER } from '../../../Store/setUser';
import { useDispatch } from 'react-redux';
 


function Topbar(props) {


  // < ---------------------------- get Token Session ---------------------------->
  let sessionStorage = window.sessionStorage;
  let body = {
    w_auth : sessionStorage.getItem('w_auth'),
    w_authExp : sessionStorage.getItem('w_authExp')
  }

  // < ---------------------------- CSS ---------------------------->
  const topMenuFontSize = {
    fontSize:'13px'
 }

  // < ---------------------------- get props ---------------------------->

  let userNikname = props.userNikname

   // < ---------------------------- Redux ---------------------------->

  let dispatch = useDispatch()

  // < ---------------------------- Navigate ---------------------------->

    let navigate = useNavigate()

    // < ----------------------------Cookie function ---------------------------->

    let deleteCookie = function(name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
  }

   // < ----------------------------Logout function ---------------------------->

    function logout(){
      axios.post('/api/user/logout',body)
      .then(response => {
        if (response.data.success) {
          console.log(response)   

          // 쿠키 삭제
          deleteCookie('w_authExp')
          deleteCookie('w_auth')  
          
          // 세션 삭제
          sessionStorage.clear()


          // Redux 정보 삭제
          dispatch(DELETE_TOKEN);
          dispatch(DELETE_USER)

          // localStroage 정보 삭제
          localStorage.clear()

                   
          // eslint-disable-next-line no-restricted-globals
          location.reload()
        } else {
          alert('로그아웃에 실패하였습니다.')
        }
      })}
     // < ---------------------------- UI ---------------------------->

      return (        
        <div>
          <Navbar style={{height:'40px'}}>
            <Container>
            <Navbar.Brand onClick={()=>{navigate('/')}} style={{cursor:'pointer', fontSize:'15px', fontWeight:'bold'}}>CHALI NUNA</Navbar.Brand>
            
              <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <GetAvatar/>
                <span>&nbsp;&nbsp;</span>
                  <NavDropdown style={topMenuFontSize} title={userNikname} id="navbarScrollingDropdown">
                  <NavDropdown.Item style={topMenuFontSize} onClick={()=>{navigate('/user/about')}}
                  >회원 정보</NavDropdown.Item>
                  <NavDropdown.Item style={topMenuFontSize} href="#action4">설정</NavDropdown.Item>
                  <Dropdown.Divider></Dropdown.Divider>
                  <NavDropdown.Item style={topMenuFontSize} href="#action5">고객센터</NavDropdown.Item>
            </NavDropdown>

                {/* <Navbar.Text><a href="#login">{props.userNikname}</a></Navbar.Text> */}
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      
               
                <Nav.Link 
                style={{fontSize:'13px'}}
                onClick={()=>{
                  logout()            
                  navigate('/login')
                  }}>로그아웃</Nav.Link>                
              
              </Navbar.Collapse>
            </Container>
          </Navbar>     
        </div>
      )
    
}

export default Topbar;