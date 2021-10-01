import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useHistory, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import AuthContext from '../context'
import { getDatabase, ref, runTransaction, update, set } from "firebase/database"
import { getMovieDeatil } from '../WebAPI'

const CommentContainer = styled.div`
  max-width: 60%;
  margin: 0 auto;
  p{
    text-align: left;
  }
  margin-bottom: 40px;
`
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  h2{
    cursor: pointer;
  }
`
const DateWrapper = styled.div`
  font-size: 12px;
`
const Date = styled.span`
  margin-right: 10px;
`
const Thumb = styled.span`
  cursor: pointer;
  border: 1px solid white;
  padding: 10px;
  border-radius: 50%;
  &:hover{
    background: white;
    color: black;
  }
`
const TitleSection = styled.div`
  display: flex;
  align-items: center;
  button{
    margin-right: 20px;
  }
`
const ImgContainer = styled(Link)`
  display: block;
  width: 200px;
  height: 100px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`
const ButtonSection = styled.div`

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
      console.log(res)
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
    <CommentContainer>

      <TitleWrapper>
        <TitleSection>
          {user && 
            (user.uid === comment.uid ? 
            <div>
              <button onClick={handleEditComment}>編輯</button>
              <button onClick={handleDeleteComment}>刪除</button>
              </div> : false)
          }
          {isPosterOpen && movie && <ImgContainer to={`movie/${comment.movie_id}`} style={{backgroundImage: `url('https://image.tmdb.org/t/p/w500${movie.poster_path}')`}}></ImgContainer>}
          {!isEdit && <h2 onClick={() => handleCommentOpen(comment.id)}>{comment.title}</h2>}
          {isEdit && <input type="text" value={titleValue} onChange={(e) => {handleTitleValue(e)}}/>}
        </TitleSection>

        <DateWrapper>
          <span>{comment.display_name}</span> －發布於<Date>{comment.date}</Date>
          {isThumbsUpOpen && (user && thumbsUpUsers.includes(user.uid) ? <Thumb onClick={handleThumbsUp} className="thumbs_up"><FontAwesomeIcon icon={faThumbsUp} /> {comment.thumbs_up}</Thumb> : <Thumb onClick={handleThumbsUp}><FontAwesomeIcon icon={faThumbsUp} /> {comment.thumbs_up}</Thumb>)}
        </DateWrapper>
      </TitleWrapper>
      {!comment.isHide && !isEdit && <p>{comment.content}</p>}
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