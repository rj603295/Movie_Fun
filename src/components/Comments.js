import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useHistory, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import AuthContext from '../context'
import { getDatabase, ref, runTransaction, update, set } from "firebase/database"
import { getMovieDeatil } from '../WebAPI'
import { getUserDeviceType } from '../utils'

const CommentContainer = styled.div`
  min-width: 70%;
  margin: 0 auto;
  p{
    text-align: left;
  }
  margin-bottom: 40px;
  textarea{
    width: 85%;
    height: 100px;
    margin-top: 20px;
  }
  input, textarea{
    font-size: ${props => props.isMobileDevice ? "initial" : ""}
  }
  @media (max-width: 415px) {
    min-width: 85%;

  }
`
const TitleWrapper = styled.div`

  h2{
    cursor: pointer;
  }
  @media (max-width: 415px) {
    display: block;
    
  }
`
const ThumbWrapper = styled.div`
  font-size: 0.5rem;
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  @media (max-width: 813px) {

    font-size: 0.8rem
  }
  @media (max-width: 415px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 2rem;
  }
`
const Date = styled.span`
  
`
const Thumb = styled.span`
  cursor: pointer;
  display: block;
  border: 3px solid #acb9cc;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 8% 0;
  width: 100%;
  &:hover{
    background: #edf0f9;
    color: black;
  }
  @media (max-width: 415px) {
    padding: 8% 2%;
  }
`
const TitleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.4rem;
  display: grid;
  grid-template-columns: ${props => props.column};
  button{
    margin-right: 20px;
  }
  h2{
    display: -webkit-box;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    white-space: normal;
  }
  @media (max-width: 415px) {
    font-size: 14px;
    display: grid;
    grid-template-columns: ${props => props.RWDS_column};
  }
`
const ImgContainer = styled(Link)`
  display: block;
  width: 200px;
  height: 100px;
  width: 100%;
  height: auto;
  padding: 68% 0;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @media (max-width: 415px) {
    width: 100%;
  }
`
const ButtonSection = styled.div`
@media (max-width: 415px) {
  
}
`
const TitleAndDate = styled.div`
  text-align: left;
  margin-left: ${props => props.TitleMargin};
  span{
    display: inline-block;
    font-size: 12px;
  }
  h2{
    margin-bottom: 5%;
  }
  input{
    display: block;
  }
`
const EditButton = styled.div`
  margin-top: 3%;
`
const Content = styled.p`
  font-size: 0.4rem;
  margin: 0 auto;
  margin-top: 4%;
  line-height: 1.5;
  @media (max-width: 415px) {
    font-size: 14px;
  }
`
export default function Comments({ comment, handleCommentOpen, isPosterOpen=false, isThumbsUpOpen=true }) {
  const { user } = useContext(AuthContext)
  const history = useHistory()
  const [movie, setMovie] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [titleValue, setTitleValue] = useState('')
  const [contentValue, setContentValue] = useState('')
  let thumbsUpUsers = []
  
  if(comment.thumbs_up_user){
    thumbsUpUsers = Object.keys(comment.thumbs_up_user)
  }
  useEffect(() => {
    getMovieDeatil(comment.movie_id).then((res) => {
      setMovie(res)
    })
  }, [comment.movie_id])


  const handleThumbsUp = () => {
    const db = getDatabase();
    if(!user) {
      history.push('/login')
    }
    if(user && thumbsUpUsers.includes(user.uid)) {
      runTransaction(ref(db, 'comments/' + comment.id), (comment) => {
        if (comment) {
          comment.thumbs_up--
          comment.thumbs_up_user[user.uid] = null
        }
        return comment;
      });
    } else if (user && !thumbsUpUsers.includes(user.uid)) {
      runTransaction(ref(db, 'comments/' + comment.id), (comment) => {
        if (comment) {
          comment.thumbs_up++
          if(thumbsUpUsers.length === 0){
            comment.thumbs_up_user = {};
          }
          comment.thumbs_up_user[user.uid] = 1;
        }
        return comment;
      });
    }
  }
  const handleTitleValue = (e) => {
    setTitleValue(e.target.value)
  }
  const handleContentValue = (e) => {
    setContentValue(e.target.value)
  }
  const handleEditComment = (e) => {
    setIsEdit(true)
    setTitleValue(comment.title)
    setContentValue(comment.content)
  }
  const handleEditCommentCancel = (e) => {
    setIsEdit(false)
    setTitleValue("")
    setContentValue("")
  }
  const handleCommentSubmit = (e) => {
    const db = getDatabase()
    update(ref(db, 'comments/' + comment.id), {
      title: titleValue,
      content: contentValue
    })
    setIsEdit(false)
  }
  const handleDeleteComment = () => {
    const db = getDatabase()
    if(window.confirm('確定要刪除留言？')) {
      set(ref(db, 'comments/' + comment.id), {});
    }

  }

  return (
    <CommentContainer isMobileDevice={getUserDeviceType()}>
      <TitleWrapper>
        <TitleSection column={isPosterOpen  ? "10% 80% 10%" : "90% 10%"} RWDS_column={isPosterOpen  ? "20% 65% 15%" : "80% 20%"} >
          {/* <ColumnWrapper> */}
            {isPosterOpen && movie &&
            <ImgContainer to={`movie/${comment.movie_id}`} style={{backgroundImage: `url('https://image.tmdb.org/t/p/w500${movie.poster_path}')`}}></ImgContainer>}
            <TitleAndDate TitleMargin={isPosterOpen ? "10%" : "0"}>
            {!isEdit && <h2 onClick={() => handleCommentOpen(comment.id)}>{comment.title}</h2>}
            {isEdit && <input type="text" value={titleValue} onChange={(e) => {handleTitleValue(e)}}/>}
              <span><span>{comment.display_name}</span> －發布於<Date>{comment.date}</Date></span>
              {user && 
              (user.uid === comment.uid ? 
              <EditButton>
                <button onClick={handleEditComment}>編輯</button>
                <button onClick={handleDeleteComment}>刪除</button>
                </EditButton> : false)
              }
            </TitleAndDate>
          {/* </ColumnWrapper> */}

          <ThumbWrapper>
            {isThumbsUpOpen && (user && thumbsUpUsers.includes(user.uid) ?
            <Thumb onClick={handleThumbsUp} className="thumbs_up"><FontAwesomeIcon icon={faThumbsUp} /> {comment.thumbs_up}</Thumb> : <Thumb onClick={handleThumbsUp}><FontAwesomeIcon icon={faThumbsUp} /> {comment.thumbs_up}</Thumb>)}
          </ThumbWrapper>
        </TitleSection>
      </TitleWrapper>
      {!comment.isHide && !isEdit && <Content>{comment.content}</Content>}
      {isEdit && <textarea type="text" value={contentValue} onChange={(e) => {handleContentValue(e)}}/>}
      {isEdit && 
      <ButtonSection>
          <button onClick={handleCommentSubmit}>確定</button>
          <button onClick={handleEditCommentCancel}>取消</button>
        </ButtonSection>
        }
    </CommentContainer>
  )
}