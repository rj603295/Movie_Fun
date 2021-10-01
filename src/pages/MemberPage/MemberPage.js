import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { getPeopleDetail, getPeopleMovies } from '../../WebAPI'
import Carousel from '../../components/Carousel'
import { getAuth, updateProfile,  updatePhoneNumber  } from "firebase/auth"
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  equalTo
} from 'firebase/database'
import { getMovieDeatil } from '../../WebAPI'
import AuthContext from '../../context'
import Movie from '../../components/Movie'
import Comment from '../../components/Comments'

const Container = styled.div`
  background: #1C1C1C;
  padding-top: 120px;
  color: white;
`
const Wrapper = styled.div`
  max-width: 60%;
  margin: 0 auto;
  h2{
    padding-top: 30px;
    padding-bottom: 20px;
    font-size: 40px;
    text-align: left;
    border-bottom: 1px solid white;
  }
`
const MemberDetailSection = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  border-bottom: 1px solid white;
`
const LeftContainer = styled.div`
  font-size: 20px;
`
const RightContainer = styled.div`

`
const FavoriteMovieSection = styled.div`

  border-bottom: 1px solid white;
`
const ImgContainer = styled.div`
  width: 200px;
  height: 100px;
  background-size: cover;
  background-position: center;
  margin-bottom: 10px;
`
const FavoriteContainer = styled.div`
display: flex;
 div{
  width: 20%;
  margin-right: 10px;
 }
`
const PhoneSection = styled.div`
 display: flex;
 justify-content: center;
`
const PersonalCommentSection = styled.div`
 padding-bottom: 20px;
`
const CommentSection = styled.div`

`
export default function MemberPage() {
  const [favoriteID, setFavoriteID] = useState([])
  const [favoriteMovie, setFavoriteMovie] = useState([])
  const [personalComments, setPersonalComments] = useState([])
  const [isPhoneEdit, setisPhoneEdit] = useState(false)
  const [isNicknameEdit, setIsNicknameEdit] = useState(false)
  const [nicknameValue, setNicknameValue] = useState("")
  const { user } = useContext(AuthContext)
  const history = useHistory()
  if(!user){
    history.push('/login')
  }
  console.log(user)

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

        const posts = query(ref(db, 'comments'), orderByChild("uid"), equalTo(user.uid))  
        onValue(posts, (snapshot) => {
          const data = snapshot.val()
          console.log('data',data)
          let arr = []
          if(data){
            let keys = Object.keys(data)
            for(let i = 0; i < keys.length; i++) {
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
      let arr2 = []
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

  return (
    <Container>
      <Wrapper>
        <h2>帳戶</h2>
        <MemberDetailSection>
          <LeftContainer>
            <p>會員資料</p>
          </LeftContainer>
          <RightContainer>
            {user && 
            <div>
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
        <p>喜歡影片</p>
          <FavoriteContainer>
            {favoriteMovie.map((movie) => {
              return <Movie height="300px" key={movie.id} imgUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} id={movie.id} isRating={false} />
              
              // <ImgContainer style={{ 
              //   backgroundImage: `url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")`}}></ImgContainer>
            })}
            </FavoriteContainer>

        </FavoriteMovieSection>
        <PersonalCommentSection>
          <p>評論</p>
          <CommentSection>
            {personalComments.length !== 0 ? personalComments.map((item, index) => {
              return <Comment handleCommentOpen={handleCommentOpen} comment={item} isThumbsUpOpen={false} />
            }) : <p>還沒有任何評論</p>}          
          </CommentSection>
        </PersonalCommentSection>
      </Wrapper>

      
    </Container>


  )
}