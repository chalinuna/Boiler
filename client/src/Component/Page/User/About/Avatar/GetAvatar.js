import { Avatar } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

function GetAvatar() {

    let Rstore = useSelector((state)=>{return state})

  
    let str = ''
    let test = ''
    if(Rstore.setUser.u_image == 'http://localhost:3000/avatar.jpg'){
      test = Rstore.setUser.u_image
    } else if(Rstore.setUser.u_image){
      let copy = Rstore.setUser.u_image
      str = copy.substring(14)
      test = 'http://localhost:3000/'+str
    }

    return (
        <img src={test} style={{width:'25px',height:'25px', borderRadius:'50%'}}/> 
    )
}

export default GetAvatar
