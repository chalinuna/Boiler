import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import {useNavigate } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';

function TopbarLogout() {

    let navigate = useNavigate()


    // return(

    //     <div style={{backgroundColor:'white', width:'1200px', height:'40px', margin:'0 auto', marginBottom:'10px'}}>
        
    //       <Row style={{ paddingTop:'15px', fontSize:'13px', textAlign:'left'}}>
    //         <Col onClick={()=>{navigate('/')}} style={{fontWeight:'bold', marginLeft:'30px'}}>Logo</Col>
    //         <Col style={{marginBottom:'20px'}}><SearchBar/></Col>
    //         <Col style={{marginRight:'550px'}}>검색</Col>
    //         <Col onClick={()=>{navigate('/login')}}>로그인</Col>
    //         <Col onClick={()=>{navigate('/register')}}>회원가입</Col>
    //       </Row>
    //     </div>

    // )

    return (
      <Navbar style={{height:'40px'}}>
      <Container>
        <Navbar.Brand onClick={()=>{navigate('/')}} style={{cursor:'pointer', fontSize:'15px', fontWeight:'bold'}}>CHALI NUNA</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
         
          <Nav.Link 
          style={{fontSize:'13px'}}
          onClick={()=>{navigate('/login')}}>로그인</Nav.Link>
           <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Nav.Link
          style={{fontSize:'13px'}}
          onClick={()=>{navigate('/register')}}>회원가입</Nav.Link>

        </Navbar.Collapse>
      </Container>
    </Navbar>  
    )

  }

export default TopbarLogout;