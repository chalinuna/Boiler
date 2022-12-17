import React from 'react'
import NavList from './Part/NavList';
import Topbar from './Part/Topbar';
import 'bootstrap/dist/css/bootstrap.css'
import TopbarLogout from './Part/TopbarLogout';


function Combinebar(props) {

  let isAuth = props.isAuth
  
  if (isAuth===true) {
    return(
      <div>
        <Topbar userNikname={props.userNikname}></Topbar>
        <hr style={{margin:0, color:'#a7aaad'}}/>
        <NavList userNikname={props.userNikname}></NavList>         
      </div>
    ) } else {
      return (
        <div>
          <TopbarLogout></TopbarLogout>
          <hr style={{margin:0, color:'#a7aaad'}} />
        <NavList userNikname={props.userNikname}></NavList>  
        </div>
      )
    }
}

export default Combinebar;
