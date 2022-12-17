import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import Table from 'react-bootstrap/Table';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";



function Posts(props) {

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  const [postList, setPostList] = useState([])


const navigate = useNavigate()

  let category = {
    category:props.category
}

  useEffect(() => {
    axios.post('api/board/getBoard',category)
    .then(response=> {
        if(response.data.success) {
            console.log('성공',response.data.boards)            
            setPostList(response.data.boards)
        } else {
            alert('불러오기 실패')
        }
    })
  }, []);

  return (
    <Layout>

      
      <header>
      <div style={{marginBottom:'40px',marginTop:'70px', fontSize:'20px', fontWeight:'bold'}} >공지사항</div>


      </header>
      

      <Table responsive="md">
      
        <thead>
          <tr style={{textAlign:'center'}}>
            <th>번호</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>날짜</th>
            <th>조회수</th>
            <th>좋아요</th>
          </tr>
        </thead>
        <tbody>
        {postList.slice(offset, offset + limit).map(({ subject, createdAt, writer, view, good, _id },i) => (
           <tr key={i}           
           style={{
            textAlign:'center', 
            overflow:'hidden' ,
            textOverflow:'ellipsis',
            whiteSpace:'nowrap',
            cursor:'pointer'
            }}

            onClick={()=>{navigate(`/${_id}`, {
              state:
              {
                category:props.category,
                writer: writer.nikname
              }
            })}}

           >
              <td>{i}</td>
              <td
              style={{
                textAlign:'center', 
                overflow:'hidden' ,
                textOverflow:'ellipsis',
                whiteSpace:'nowrap'             
                }}
              
              >{subject}</td>
              <td
              >{writer.nikname}</td>
              <td>{new Date(createdAt).toLocaleString('ko-KR',{month: 'long',day: '2-digit', hour:'2-digit', minute:'2-digit'})}</td>
              <td>{view}</td>  
              <td>{good}</td>            
          </tr>
        ))}
         </tbody>

         </Table>
      
      
      <div
      style={{float:'right'}}>
      <Button
        onClick={()=>{navigate('/write')}}> 공지사항 작성하기 </Button>

      <label >
        페이지 당 표시할 게시물 수:&nbsp;
        <select
          type="number"
          value={limit}
          onChange={({ target: { value } }) => setLimit(Number(value))}
        >
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      
      </label>

      

      </div>

 

      <footer>
        <Pagination
          total={postList.length}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </footer>

    
    </Layout>
  );
}

const Layout = styled.div`
  flex-direction: column;
  align-items: center;
  width: 1000px;
  margin: 0 auto;
  font-Size: 12px;
`;

export default Posts;
