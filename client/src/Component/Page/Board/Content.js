import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import "react-quill/dist/quill.core.css";
import { useSelector } from "react-redux";



function Content(){

    const [modalShow, setModalShow] = React.useState(false);
    let navigate = useNavigate()
    // ---------------------- State ----------------------

    const [doc, setDoc] = useState()
    let redux = useSelector((state)=>{return state})

    
    // ---------------------- 유저 검사 ----------------------
    let possible = false

    if(doc?.writer == redux.setUser.u_id){
        possible = true
    }

    // ---------------------- get Category ----------------------

    let location = useLocation()

    let category = location.state.category
    let writer = location.state.writer

    // ---------------------- get parameter ----------------------

    let params = useParams()

    // ---------------------- Edit Button ----------------------

    function editButton() {
        navigate(`/edit/${params.postId}`, {
            state:
            {
              category:category,
              doc: doc
            }
          })
    }

    // ---------------------- delete Button ----------------------

    function deleteModal() {
        setModalShow(true)
    }

    function deletePost() {
        let _id = {
            _id:params.postId
        }
        console.log('게시물을 삭제합니다.')
        axios.post('/api/board/deletePost',_id)
        .then(response => {
            console.log('삭제 결과',response)
        })

        navigate(-1)
    }

    // ---------------------- get Content ----------------------


    useEffect(()=>{

        let body = {
            category : category,
            postId : params.postId
        }

        axios.post('/api/board/getContent',body)
        .then(response=>{
            console.log(response)
            setDoc(response.data.doc)
        })       

    },[])

    
        return(    

            <div style={{width:'100%'}}>
            <div style={{width:'1200px', margin:'0 auto', marginTop:'50px'}}>
          
            <div>
            <Card style={{ width: '80rem'}}>
            <Card.Header>
                <span
                style={{
                    marginLeft:'20px'}}
                >{doc?.subject}</span>
               </Card.Header>
            <ListGroup
             style={{
                marginLeft:'20px'}}            
            variant="flush">
                <ListGroup.Item
                style={{fontSize:'12px'}}
                > <span>글쓴이 : {writer}&nbsp;&nbsp;&nbsp;&nbsp;날짜 : {new Date(doc?.createdAt).toLocaleString('ko-KR')}</span>
                </ListGroup.Item>
              <ListGroup.Item>
                  <div  className="view ql-editor" dangerouslySetInnerHTML={{ __html: doc?.content }} />                  
                  </ListGroup.Item>
            </ListGroup>
          </Card> 

         
            {
                possible ? <span style={{float:'right', marginTop:'10px'}}>
                <Button variant="danger" onClick={deleteModal} style={{marginRight:'10px'}} >삭제</Button>
                <Button variant="dark" onClick={editButton}>수정</Button>   
                </span> : <span></span>
            }
            
          </div>
                  
          </div>
          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            deletePost={deletePost}
      />

          </div>
            
    ) 

}


function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           글을 삭제합니다.
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            게시물을 삭제하시겠습니까?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button  variant="dark" onClick={props.onHide}>취소</Button>
          <Button  variant="danger" onClick={props.deletePost}>삭제</Button>
        </Modal.Footer>
      </Modal>
    );
  }




export default Content;