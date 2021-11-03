import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'
import {
  getMovieDeatil,
  getMovieRating,
  getCredits,
  getSimilar,
  getVideo,
  getMovieImage
} from '../../WebAPI'
import Carousel from '../../components/Carousel'
import { useColor } from 'color-thief-react'
import RatingList from '../../components/Rating'
import {
  getDatabase,
  ref,
  onValue,
  push,
  query,
  orderByChild,
  equalTo
} from 'firebase/database'
import AuthContext from '../../context'
import { getDate, getCreatedAt, getUserDeviceType } from '../../utils'
import Comment from '../../components/Comments'
import Person from '../../components/Person'
import Movie from '../../components/Movie'
import { SRLWrapper } from 'simple-react-lightbox'
import Loading from '../../components/Loading'

const LeftContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: auto;
  padding: 15%;
  box-sizing: border-box;
`
const RightContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  font-size: 0.6rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  li{
    list-style-type:none;
  }
  .rating-list{
    margin-top: 5%;
  }
  @media (max-width: 415px) {
    width: 90%;
    font-size: 14px;
    margin: 0 auto;
    h2{
      font-size: 18px;
    }
    .rating-list{
      
    }
  }
`
const Wrapper = styled.div`
  margin: 30px 100px;
  @media (max-width: 415px) {
    margin: 80px 0;
  }
`
const DetailContainer = styled.div`

  display: grid;
  grid-template-columns: 50% 50%;
  z-index: 10000;
  @media (max-width: 415px) {
    display: block;
  }
`
const Recommendations = styled.div`
  display: flex;
`
const CarouselConatiner = styled.div`
  max-width: 95%;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
  box-sizing: border-box;
  .RWD-S{
    display: none;
  }
  @media (max-width: 415px) {
    max-width: 100%;

    .RWD-S{
      display: block;
    }
    .RWD-L{
      display: none;
    }
  }
`
const Container = styled.div`
  padding: 0;
  font-size: 1rem;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(255,255,255, 0.5);
  min-height: 100vh;
  padding-top: 5%;
  padding-bottom: 5%;
  h2{
    font-size: 1rem;
  }
  @media (max-width: 415px) {
    padding-bottom: 0;
    h2{
      font-size: 2.3rem;
    }
  }
`
const RecommendImgContainer = styled(Link)`
  display: inline-block;
  width: 100%;
  padding: 30% 0;
  margin-right: 10px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  @media (max-width: 415px) {
    height: 150px;
  }
  `
const Date = styled.span`
  
`
const MovieDetailContent = styled.ul`
  text-align: left;
  font-size: 0.5rem;
  margin-top: 5%;
  line-height: 2;
  @media (max-width: 415px) {
    width: 100%;
    font-size: 14px;
  }
`
const MovieVideoSection = styled.div`
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;
  padding-top: 25.25%;
  margin-top: 5%;
  .responsive-iframe {
    position: absolute;
    top: 0%;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
  p{
    text-align: center;
    font-size: 32px;
    margin-bottom: 5%;
  }
  .RWD-S{
    margin: 0 auto;
    display: none;
    opacity: 0;
  }
  @media (max-width: 415px) {
    max-width: 90%;
    padding-top: 50.25%;
    p{
      text-align: center;
      font-size: 25px;
      margin-bottom: 15px;
    }
    .RWD-S{
      display: block;
      opacity: 1;
    }
    .RWD-L{
      display: none;
      opacity: 0;
    }
  }
`
const MovieImgSection = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const MovieImg = styled.img`
  height: auto;
  width: 100%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  &:hover{
    transition: 0.5s;
    transform: scale(1.1);
  }
  @media (max-width: 415px) {
   
  }
`
const Keyword = styled.span`
  display: inline-block;
  font-size: 0.5rem;
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  word-break: keep-all;
  padding: 5px;
  @media (max-width: 415px) {
    font-size: 14px;
  }
`
const CommentSection = styled.div`
  padding: 80px;
  width: 60%;
  margin: 0 auto;
  a{
    color: white;
  }
  @media (max-width: 415px) {
    padding: 0;
    margin-bottom: 50px;
    width: 85%;
  }
`
const Pagination = styled.div`

`
const AddCommentSection = styled.div`
  width: 50%;
  margin: 0 auto;
  input[type=submit]{
    margin-top: 3%;
  }
  input, textarea{
    font-size: ${props => props.isMobileDevice ? 'initial' : '0.5rem'}
  }
`
const AddCommentColumn = styled.div`
  display: grid;
  grid-template-columns: 15% 85%;
`
const Comments = styled.div`
  margin-bottom: 2%;
`
const NoComment = styled.p`
  margin-bottom: 2%;
`
function Credits ({ credits }) {
  return (
    <CarouselConatiner>
      <div className="RWD-L">
        <Carousel cols={ 6 } gap={ 10 }>
          {credits.map((item) =>
            <Carousel.Item key={ item.id }>
              <div>
                {item.profile_path !== 'null' &&
                <Person person={ item } />
            }
              </div>
            </Carousel.Item>
          )}
        </Carousel>
      </div>
      <div className="RWD-S">
        <Carousel cols={ 3 } gap={ 0 }>
          {credits.map((item) =>
            <Carousel.Item key={ item.id }>
              <div>
                {item.profile_path !== 'null' &&
                <Person person={ item } />
            }

              </div>
            </Carousel.Item>
          )}
        </Carousel>
      </div>

    </CarouselConatiner>
  )
}
export default function MovieDetailPage () {
  const [isLoading, setIsLoading] = useState(true)
  const [movie, setMovie] = useState([])
  const [rating, setRating] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [credits, setCredits] = useState([])
  const [director, setDirector] = useState({})
  const [video, setVideo] = useState([])
  const [images, setImages] = useState([])
  const [comments, setComments] = useState([])
  const [commentTitle, setcommentTitle] = useState('')
  const [commentContent, setcommentContent] = useState('')
  const [isCommentInputOpen, setisCommentInputOpen] = useState(false)
  const [currentCommentPage, setCurrentCommentPage] = useState(1)
  const [totalCommentPage, settotalCommentPage] = useState(1)
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const options = {
    buttons: {
      showNextButton: false,
      showPrevButton: false
    },
    thumbnails: {
      showThumbnails: false
    }
  }
  useEffect(() => {
    function getComments () {
      const db = getDatabase()
      const posts = query(ref(db, 'comments'), orderByChild('movie_id'), equalTo(id))
      onValue(posts, (snapshot) => {
        const data = snapshot.val()
        const arr = []
        if (data) {
          const keys = Object.keys(data)
          const totalPage = Math.ceil(keys.length / 5)
          settotalCommentPage(totalPage)
          let len
          if (keys.length >= 5) {
            len = 5
          } else {
            len = keys.length
          }
          for (let i = 0; i < len; i++) {
            arr.push(
              {
                ...data[keys[i]],
                isHide: true,
                id: keys[i]
              }
            )
          }
          setComments(arr.reverse())
        } else {
          setComments([])
        }
      })
    }
    getComments()
  }, [id])

  let src = ''
  const format = 'rgbArray'
  const crossOrigin = 'anonymous'
  const quality = 10
  if (movie.poster_path) {
    src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
  }
  const { data } = useColor(src, format, { crossOrigin, quality })
  let backgroundMask = ''
  let lightness = 0
  let colorStr = ''
  if (data) {
    let str = 'rgba('
    for (let i = 0; i < data.length; i++) {
      str += data[i] + ','
    }
    str += '0.8)'
    backgroundMask = str
  }

  if (data) {
    const red = data[0]
    const green = data[1]
    const blue = data[2]
    lightness = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255
    colorStr = `hsl(0, 0%, calc((${lightness} - 0.5) * -999999%))`
  }
  useEffect(() => {
    window.scrollTo(0, 0)
    setIsLoading(true)
    getMovieDeatil(id).then((res) => {
      setMovie(res)
      return res
    }).then((res) => {
      setIsLoading(false)
      getVideo(res.id).then((res) => {
        const videoArr = res.results.filter(item => {
          return item.type === 'Trailer'
        })
        setVideo(videoArr[0])
      })
      getMovieRating(res.imdb_id).then((res) => {
        setRating(res.Ratings)
      })
      getSimilar(res.id).then((res) => {
        setRecommendations(res.results)
      })
    })
    getCredits(id).then((res) => {
      const director = res.crew.filter((item) => {
        return item.job === 'Director'
      })
      setCredits(res.cast)
      setDirector(director[0])
    })
    getMovieImage(id).then((res) => {
      const imgArr = res.backdrops
      setImages(imgArr)
    })
  }, [id])

  const handleCommentSubmit = () => {
    function writeUserData () {
      const db = getDatabase()
      const date = getDate()
      const createdAt = getCreatedAt()
      push(ref(db, 'comments'), {
        content: commentContent,
        title: commentTitle,
        date: date,
        display_name: user.providerData[0].displayName,
        thumbs_up: 0,
        movie_id: id,
        uid: user.uid,
        createdAt: createdAt
      })
    }
    if (commentTitle !== '' && commentContent !== '') {
      writeUserData()
      setcommentTitle('')
      setcommentContent('')
    } else {
      alert('請輸入評論標題及內容')
    }
  }
  const handleCommentOpen = (id) => {
    setComments(comments.map((item) => {
      if (item.id !== id) return item
      return {
        ...item,
        isHide: !item.isHide
      }
    }))
  }
  const handleCommentPage = (isNextPage) => {
    const db = getDatabase()
    const posts = query(ref(db, 'comments'), orderByChild('movie_id'), equalTo(id))
    if (isNextPage) {
      onValue(posts, (snapshot) => {
        const data = snapshot.val()
        const arr = []
        if (data) {
          const keys = Object.keys(data)
          let len
          if (keys.length >= currentCommentPage * 5 + 4) {
            len = currentCommentPage * 5 + 4
          } else {
            len = keys.length
          }
          for (let i = currentCommentPage * 5; i < len; i++) {
            arr.push(
              {
                ...data[keys[i]],
                isHide: true,
                id: keys[i]
              }
            )
          }
          setComments(arr.reverse())
          setCurrentCommentPage(currentCommentPage + 1)
        }
      })
    } else if (!isNextPage) {
      onValue(posts, (snapshot) => {
        const data = snapshot.val()
        const arr = []
        if (data) {
          const keys = Object.keys(data)
          let len
          if (keys.length >= (currentCommentPage - 2) * 5 + 4) {
            len = (currentCommentPage - 2) * 5 + 4
          } else {
            len = keys.length
          }
          for (let i = (currentCommentPage - 2) * 5; i < len; i++) {
            arr.push(
              {
                ...data[keys[i]],
                isHide: true,
                id: keys[i]
              }
            )
          }
          setComments(arr.reverse())
          setCurrentCommentPage(currentCommentPage - 1)
        }
      })
    }
  }

  return (
    <div style={ {
      backgroundColor: '#1C1C1C', color: 'white'
    } }
    >
      <Loading isLoading={ isLoading } />
      {movie.poster_path &&
      <Container style={ {
        backgroundImage: `linear-gradient(to top, #1C1C1C, ${backgroundMask}), url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")`
      } }
      >
        <Wrapper>
          <DetailContainer>
            <LeftContainer>
              <Movie
                id={ movie.id }
                imgUrl={ `https://image.tmdb.org/t/p/w500${movie.poster_path}` }
                key={ movie.id }
                movie={ movie }
              />
            </LeftContainer>
            <RightContainer style={ {
              color: `${colorStr}`
            } }
            >
              <h2>{movie.title}<Date>({movie.release_date.substr(0, 4)})</Date></h2>
              <p>{movie.overview}</p>
              {rating && <div className="rating-list"><RatingList Ratings={ rating }></RatingList></div>}
              <MovieDetailContent>
                {director && <li>導演：{director.name}</li>}
                <li>片長：{movie.runtime}</li>
                <li>官方網站：{movie.homepage}</li>
                <li>關鍵字：{movie.keywords.keywords.map((item, index) => {
                  return <Keyword key={ index } style={ { border: `1px solid ${colorStr}` } }>{'#' + item.name}</Keyword>
                })}</li>
              </MovieDetailContent>
            </RightContainer>
          </DetailContainer>
          <h2>相關圖片：</h2>
          <MovieImgSection>
            <CarouselConatiner>
              <div className="RWD-L">
                <Carousel cols={ 4 } gap={ 10 }>
                  {images && images.map((item, index) => {
                    return <Carousel.Item key={ index }>
                      <SRLWrapper options={ options }>
                        <MovieImg src={ `https://image.tmdb.org/t/p/original${item.file_path}` }></MovieImg>
                      </SRLWrapper>
                    </Carousel.Item>
                  })}
                </Carousel>
              </div>
              <div className="RWD-S">
                <Carousel cols={ 2 } gap={ 10 }>
                  {images && images.map((item, index) => {
                    return <Carousel.Item key={ index }>
                      <SRLWrapper options={ options }>
                        <MovieImg src={ `https://image.tmdb.org/t/p/original${item.file_path}` }></MovieImg>
                      </SRLWrapper>
                    </Carousel.Item>
                  })}
                </Carousel>
              </div>
            </CarouselConatiner>
          </MovieImgSection>
          <h2>預告：</h2>
          <MovieVideoSection>
            {video && <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="responsive-iframe" frameBorder="0" src={ `https://www.youtube.com/embed/${video.key}?autoplay=0` } title="YouTube video player"></iframe>}
          </MovieVideoSection>
        </Wrapper>
      </Container>}
      <h2>Credits</h2>
      <Credits credits={ credits }></Credits>
      <h2>Comments</h2>
      <CommentSection>
        <Comments>
          {comments.length !== 0
            ? comments.map((item) => {
              return <Comment comment={ item } handleCommentOpen={ handleCommentOpen } key={ item.id } />
            })
            : <NoComment>還沒有任何評論</NoComment>}
          {user ? <button onClick={ () => { setisCommentInputOpen(!isCommentInputOpen) } }>新增評論</button> : <Link to="/login">點我登入評論</Link>}
        </Comments>
        {isCommentInputOpen &&
        <AddCommentSection isMobileDevice={ getUserDeviceType() }>
          <AddCommentColumn>
            <span>標題：</span><input onChange={ (e) => setcommentTitle(e.target.value) } type="text" value={ commentTitle } />
          </AddCommentColumn>
          <AddCommentColumn>
            <span>內容：</span><textarea onChange={ (e) => setcommentContent(e.target.value) } type="text" value={ commentContent } />
          </AddCommentColumn>
          <input onClick={ handleCommentSubmit } type="submit"></input>
        </AddCommentSection>
          }
        <Pagination>
          {currentCommentPage !== 1 ? <button onClick={ () => { handleCommentPage(false) } }>&lt;</button> : false}
          {currentCommentPage}
          {totalCommentPage !== currentCommentPage ? <button onClick={ () => { handleCommentPage(true) } }>&gt;</button> : false}
        </Pagination>
      </CommentSection>
      <h2>推薦專區</h2>
      <Recommendations>
        <CarouselConatiner>
          <Carousel cols={ 3 } gap={ 10 }>
            {recommendations.map((item) =>
              <Carousel.Item key={ item.id }>
                <div>
                  {item.poster_path && <RecommendImgContainer
                    style={ {
                      backgroundImage: `url("https://image.tmdb.org/t/p/w500${item.poster_path}")`
                    } } to={ `/movie/${item.id}` }
                                       >
                  </RecommendImgContainer>}
                </div>
              </Carousel.Item>
            )}
          </Carousel>
        </CarouselConatiner>
      </Recommendations>
    </div>
  )
}
