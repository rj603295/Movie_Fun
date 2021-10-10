import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { getAuth, updateProfile } from "firebase/auth"
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database'
import { getMovieDeatil } from '../../WebAPI'
import AuthContext from '../../context'
import Movie from '../../components/Movie'
import Comment from '../../components/Comments'

const Container = styled.div`
  background: #1C1C1C;
  padding-top: 120px;
  color: white;
  font-size: 0.5rem;
`
const Wrapper = styled.div`
  max-width: 60%;
  margin: 0 auto;
  .title{
    padding-top: 5%;
    padding-bottom: 5%;
    font-size: 1.5rem;
    text-align: left;
    border-bottom: 1px solid white;
  }
  @media (max-width: 415px) {
    max-width: 80%;
  }
`
const MemberDetailSection = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  border-bottom: 1px solid white;
  @media (max-width: 415px) {
    grid-template-columns: 30% 70%;
  }
`
const LeftContainer = styled.div`
  font-size: 0.6rem;
  p{
    padding: 5% 0;
  }
`
const RightContainer = styled.div`
  font-size: 0.45rem;
  button{
    margin-left: 1%;
    font-size: 0.1rem;
  }
  .user-content{
    padding: 5% 0;
    line-height: 1.5;
  }
`
const FavoriteMovieSection = styled.div`
  p{
    font-size: 1rem;
    padding: 5% 0;
  }
  border-bottom: 1px solid white;
`
const FavoriteContainer = styled.div`
.favorite-movie{
  margin: 1%;
  box-sizing: border-box;
}
p{
  font-size: 1rem;
  padding: 5% 0;
}
.RWD-L{
  display: flex;
  flex-wrap: wrap;
  .favorite-movie{
    width: 22%;
    margin-right: 5px;
    margin-bottom: 20px;
  }
}
.RWD-S{
  display: none;
}
 margin-bottom: 5%;
@media (max-width: 415px) {
  .RWD-S{
    display: flex;
    flex-wrap: wrap;
    .favorite-movie{
      width: 45%;
    }
  }
  .RWD-L{
    display: none;
  }
}

`
const PhoneSection = styled.div`
 display: flex;
 justify-content: center;
`
const PersonalCommentSection = styled.div`

 padding-bottom: 5%;
 min-width: 100%;

`
const CommentSection = styled.div`

  margin: 0 auto;
`
const Pagination = styled.div`

`
const Title = styled.p`
  font-size: 1rem;
  padding: 5% 0;
`
export default function MemberPage() {
  const [favoriteID, setFavoriteID] = useState([])
  const [favoriteMovie, setFavoriteMovie] = useState([])
  const [personalComments, setPersonalComments] = useState([])
  const [isNicknameEdit, setIsNicknameEdit] = useState(false)
  const [nicknameValue, setNicknameValue] = useState("")
  const [currentCommentPage, setCurrentCommentPage] = useState(1)
  const [totalCommentPage, settotalCommentPage] = useState(1)
  const { user } = useContext(AuthContext)
  const history = useHistory()
  if(!user){
    history.push('/login')
  }
  useEffect(() => {
    if(user){
      const db = getDatabase()
      const memberFavoriteRef = ref(db, 'favorite/' + user.uid)
      let keyArr = []
      onValue(memberFavoriteRef, (snapshot) => {
        const data = snapshot.val()
        if(data){
          keyArr = Object.keys(data)
          let arr = []
          for(let i = 0; i < keyArr.length; i++) {
            arr.push(keyArr[i])
          }
          setFavoriteID(arr)
        }

    
        });

        const posts = query(ref(db, 'comments'), orderByChild("uid"),  equalTo(user.uid))  
        //const posts = query(ref(db, 'comments'), orderByChild("created_at"), limitToFirst(5))
        onValue(posts, (snapshot) => {
          const data = snapshot.val()
          let arr = []
          if(data){
            let keys = Object.keys(data)
            let totalPage = Math.ceil(keys.length / 5)
            settotalCommentPage(totalPage)
            let len
            if(keys.length >= 5) {
              len = 5
            } else {
              len = keys.length
            }
            for(let i = 0; i < len; i++) {
                arr.push(
                  {
                    ...data[keys[i]], 
                    isHide: true,
                    id: keys[i]
                  }
                )
            }
            setPersonalComments(arr.reverse())
          }
        });
    }
  }, [user])

  useEffect(() => {
    async function fetchData() {
      let arr = []
      for(let i = 0; i < favoriteID.length; i++) {
        await getMovieDeatil(favoriteID[i]).then((res) => {
          console.log(res)
          arr.push(res)
        })
      }
      setFavoriteMovie(arr)
    }
    fetchData()
  }, [favoriteID])

  const handleNicknameInputOpen = () => {
    if(!isNicknameEdit){
      if(user.providerData[0].displayName){
        setNicknameValue(user.providerData[0].displayName)
      } else {
        setNicknameValue("")
      }

    }
    setIsNicknameEdit(!isNicknameEdit)
  }
  const handleNicknameInputChange = (e) => {
    setNicknameValue(e.target.value)
  }
  const handleNicknameSubmit = () => {
    const auth = getAuth()
    updateProfile(auth.currentUser, {
      displayName: nicknameValue
    }).then(() => {
      console.log('修改暱稱成功')
    }).catch((error) => {
      console.log('修改暱稱失敗')
    });
  }
  const handleCommentOpen = (id) => {
    setPersonalComments(personalComments.map((item) => {
      if (item.id !== id) return item
      return {
        ...item,
        isHide: !item.isHide
      }
    }))
  }
  const handleCommentPage = (isNextPage) => {
    const db = getDatabase()
    const posts = query(ref(db, 'comments'), orderByChild("uid"),  equalTo(user.uid))  
    if(isNextPage) {
      onValue(posts, (snapshot) => {
        const data = snapshot.val()
        let arr = []
        if(data){
          let keys = Object.keys(data)
          let len
          if(keys.length >= currentCommentPage * 5 + 4) {
            len = currentCommentPage * 5 + 4
          } else {
            len = keys.length
          }
          for(let i = currentCommentPage * 5; i < len; i++) {
            // if(data[keys[i]].created_at < personalComments[4]){
              arr.push(
                {
                  ...data[keys[i]], 
                  isHide: true,
                  id: keys[i]
                }
              )
            // }
  
          }
          setPersonalComments(arr.reverse())
          setCurrentCommentPage(currentCommentPage + 1)
        }
      });
    } else if (!isNextPage) {
      onValue(posts, (snapshot) => {
        const data = snapshot.val()
        let arr = []
        if(data){
          let keys = Object.keys(data)
          let len
          if(keys.length >= (currentCommentPage-2) * 5 + 4) {
            len = (currentCommentPage-2) * 5 + 4
          } else {
            len = keys.length
          }
          for(let i = (currentCommentPage-2) * 5; i < len; i++) {
            // if(data[keys[i]].created_at < personalComments[4]){
              arr.push(
                {
                  ...data[keys[i]], 
                  isHide: true,
                  id: keys[i]
                }
              )
            // }
  
          }
          setPersonalComments(arr.reverse())
          setCurrentCommentPage(currentCommentPage - 1)
        }
      });
    }

  }
  return (
    <Container>
      <Wrapper>
        <h2 className="title">帳戶</h2>
        <MemberDetailSection>
          <LeftContainer>
            <p>會員資料</p>
          </LeftContainer>
          <RightContainer>
            {user && 
            <div className="user-content">
            <p>{user.email}</p>
            <p>信箱驗證：{user.emailVerified ? "已驗證" : "尚未驗證"}</p>
            <PhoneSection>
              <p>暱稱：{!isNicknameEdit ? (user.providerData[0].displayName ? user.providerData[0].displayName : "尚未填寫") : false}</p>
              {isNicknameEdit && 
              <div>
                <input type="text" value={nicknameValue} onChange={(e) => {handleNicknameInputChange(e)}}/>
                <button onClick={handleNicknameSubmit}>確認</button>
                <button onClick={handleNicknameInputOpen}>取消</button>
              </div>

              }
              {!isNicknameEdit && <button onClick={handleNicknameInputOpen}>修改</button>}
              </PhoneSection>
            </div>

            }
          </RightContainer>
        </MemberDetailSection>
        <FavoriteMovieSection>
        <Title>喜歡影片</Title>
          <FavoriteContainer>
            <div className="RWD-L">
            {favoriteMovie.map((movie) => {
              return <div className="favorite-movie"><Movie key={movie.id} movie={movie} imgUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} id={movie.id} isRating={false} /></div>
            })}
            </div>
            <div className="RWD-S">
            {favoriteMovie.map((movie) => {
              return <div className="favorite-movie"><Movie key={movie.id} movie={movie} imgUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} id={movie.id} isRating={false} /></div>
            })}
            </div>


          </FavoriteContainer>
        </FavoriteMovieSection>
        <PersonalCommentSection>
          <Title>歷史評論</Title>
          <CommentSection>
            {personalComments.length !== 0 ? personalComments.map((item, index) => {
              return <Comment handleCommentOpen={handleCommentOpen} comment={item} isThumbsUpOpen={true} isPosterOpen={true}/>
            }) : <p>還沒有任何評論</p>}          
          </CommentSection>
          <Pagination>
              {currentCommentPage !== 1 ? <button onClick={() => {handleCommentPage(false)}}>&lt;</button> : false}
              {currentCommentPage}
              {totalCommentPage !== currentCommentPage ? <button onClick={() => {handleCommentPage(true)}}>&gt;</button>: false}
          </Pagination>
        </PersonalCommentSection>
      </Wrapper>

      
    </Container>


  )
}