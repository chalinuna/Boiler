import { MenuOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';

function NavList(props) {


  const navigate = useNavigate()
  // < ---------------------------- CSS ---------------------------->
  const NavFontSize = {
    fontSize:'15px',
    fontWeight:'bold'
 }

  // < ---------------------------- setMenu ---------------------------->

    const [menuList, setMenuList] = useState([])

    useMemo( () => {       

        // getMenu에 현재 메뉴 몽고db에서 받아오기
    const getMenu = ['메뉴하나','메뉴둘','메뉴셋','메뉴넷','메뉴다섯','메뉴여섯']
    setMenuList(getMenu)
    }, [])

  let expand = 'lg'

  return (
    <>    
      <Navbar key={expand} bg="white" expand={expand} style={{marginTop:'0.3rem', marginBottom:'0.3rem'}}>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" > 
         
            </Navbar.Toggle>
           
          {/* Offencanvas = Toggle Area */}
          <Navbar.Offcanvas
            // id={`offcanvasNavbar-expand-${expand}`}
            // aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            // placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} style={{fontSize:'14px'}}>
              {props.userNikname} 님 로그인되었습니다.
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav style={NavFontSize} >
                <DropDownButton ></DropDownButton>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <Nav.Link onClick={()=>{navigate('/notice')}} >공지사항</Nav.Link>
                <Nav.Link href="#action2">자유게시판</Nav.Link>
                <Nav.Link href="#action3">자주묻는질문</Nav.Link>
                <Nav.Link href="#action4">게시판하나</Nav.Link>
                <Nav.Link href="#action5">게시판둘</Nav.Link>
                <Nav.Link href="#action6">게시판셋</Nav.Link>
               
              </Nav>
              
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          {/* Search */}
          <Form className="d-flex" style={{height:'30px'}}>
                <Form.Control
                style={{fontSize:'13px', width:'230px'}}
                  type="search"
                  placeholder="검색할 내용을 입력하세요 . . ."
                  className="me-2"
                  aria-label="Search"
                />      
              <Button style={{height:'30px'}} icon={<SearchOutlined style={{verticalAlign:'0.2em'}}/>}/>
              </Form>
               
        </Container>
      </Navbar>
    
  </>
  ) 
}

// < ---------------------------- Category DropDown Button ---------------------------->

function DropDownButton() {

  const categoryStyle = {
    fontSize:'14px'
  }

  return (
    <DropdownButton variant="dark" id="dropdown-basic-button" title="카테고리" >
      <Dropdown.Item href="#/action-1" style={categoryStyle} >카테고리 하나</Dropdown.Item>
      <Dropdown.Item href="#/action-2" style={categoryStyle} >카테고리 둘</Dropdown.Item>
      <Dropdown.Item href="#/action-3" style={categoryStyle} >카테고리 셋</Dropdown.Item>
      <Dropdown.Divider></Dropdown.Divider>
      <Dropdown.Item href="#/action-4" style={categoryStyle} >카테고리 넷</Dropdown.Item>
    </DropdownButton>
  );
}

export default NavList;
