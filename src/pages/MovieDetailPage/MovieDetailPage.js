import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { Link, useLocation, useHistory, useParams } from 'react-router-dom'
import { getMovieDeatil, getSearchData, getMovieRating, getCredits, getSimilar, getVideo, getMovieImage } from '../../WebAPI'
import Carousel from '../../components/Carousel'
import Color, { useColor } from 'color-thief-react'
import RatingList from '../../components/Rating'
import { getDatabase, ref, onValue, set, push, query, orderByChild, equalTo} from "firebase/database";
import AuthContext from '../../context'
import { getDate } from '../../utils'
import Comment from '../../components/Comments'
import Movie from '../../components/Movie'

const LeftContainer = styled.div`
  width: 50%;
  height: 100vh;
`
const RightContainer = styled.div`
  width: 50%;
  font-size: 18px;
  line-height: 1.5;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  li{
    list-style-type:none;
  }
`
const Wrapper = styled.div`
  display: flex;
  margin: 30px 100px;
  z-index: 10000;
`
const Recommendations = styled.div`
  display: flex;
`
const CarouselConatiner = styled.div`
  max-width: 95%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`
const BackGroundContainer = styled(Link)`
  display: block;
  height: 500px;
  width: 500PX;
  margin-right: 10px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`
const Container = styled.div`
  padding: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(255,255,255, 0.5);
  min-height: 100vh;
  padding-top: 5%;
  padding-bottom: 5%;
`
const BgCover = styled.div`
  position: absolute;
  background-color: rgba(255,255,255, 0.5);
  height: 500px;
  z-index: 999;
  width: 100%;
`
const ImgContainer = styled(Link)`
  display: inline-block;
  height: 300px;
  width: 100%;
  margin-right: 10px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

`
const PosterContainer = styled.div`
  display: block;
  height: 90%;
  width: 100%;
  margin-right: 10px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`
const Date = styled.span`
  
`
const MovieDetailContent = styled.ul`
  text-align: left;
  font-size: 18px;
  line-height: 2;
`
const MovieVideoSection = styled.div`
  height: 500px;
  max-width: 60%;
  margin: 0 auto;
  p{
    text-align: left;
    font-size: 32px;
  }
`
const MovieImgSection = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const MovieImg = styled.div`
  height: 175px;
  width: 25%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  &:hover{
    transition: 0.5s;
    transform: scale(1.1);
  }
`
const Keyword = styled.span`
  margin-right: 2px;
  border-radius: 10px;
  margin-right: 10px;
  word-break: keep-all;
`
const CommentSection = styled.div`
  padding: 80px;
  a{
    color: white;
  }
`
// const RatingList = styled.div`
//   display: flex;
//   align-items: end;
//   li{
//     margin-right: 20px;
//   }
// `
// const Credits = styled.div`
  
// `
function Credits({ credits }) {
  return (
    <CarouselConatiner>
      <Carousel cols={6} gap={0}>
        {credits.map((item, index) =>
          <Carousel.Item key={item.id}>
          
            <div>
            {item.profile_path && 
            <ImgContainer style={{ 
              backgroundImage: `url("https://image.tmdb.org/t/p/w500${item.profile_path}")` 
            }} to={`/credit/${item.id}`}>     
            </ImgContainer>}
              <p>{item.original_name}</p>
            </div>
          </Carousel.Item>        
        )}
        </Carousel>
      </CarouselConatiner>
  )
}
export default function MovieDetailPage() {
  
  const location = useLocation()
  const history = useHistory()
  const [movie, setMovie] = useState([])
  const [rating, setRating] = useState([])
  const [search, setSearch] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [credits, setCredits] = useState([])
  const [director, setDirector] = useState({})
  const [video, setVideo] = useState([])
  const [images, setImages] = useState([])
  const [comments, setComments] = useState([])
  const [commentsKey, setCommentskey] = useState([])
  const [commentTitle, setcommentTitle] = useState('')
  const [commentContent, setcommentContent] = useState('')
  const [isCommentInputOpen, setisCommentInputOpen] = useState(false)
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  
  useEffect(() => {
    function getComments() {
      const db = getDatabase();
      const posts = query(ref(db, 'comments'), orderByChild("movie_id"), equalTo(id))  
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
            setComments(arr.reverse())
            setCommentskey(keys.reverse())
          }
          
        });
      
      
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
  const { data, loading, error } = useColor(src, format, { crossOrigin, quality})
  let backgroundMask = ''
  let lightness = 0
  let colorStr = ''
  if(data) {
    let str = 'rgba('
    for(let i = 0; i < data.length; i++) {
      str += data[i] + ','
    }
    str += '0.8)'
    backgroundMask = str
    console.log(backgroundMask)
  }

  if(data) {  
    let red = data[0]
    let green = data[1]
    let blue = data[2]
    lightness = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255
    colorStr = `hsl(0, 0%, calc((${lightness} - 0.5) * -999999%))`
  }

  useEffect(() => {
    getMovieDeatil(id).then((res) => {
      console.log(res)
      setMovie(res)
      return res
    }).then((res) => {
      getVideo(res.id).then((res) => {
        let videoArr = res.results.filter(item => {
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

      let director = res.crew.filter((item) => {
        return item.job === 'Director'
      })
      setCredits(res.cast)
      setDirector(director[0])
    })
    getMovieImage(id).then((res) => {
      let imgArr = res.backdrops.slice(3, 7)
      setImages(imgArr)
    })
  }, [id])

  const handleCommentSubmit = () => {
    function writeUserData(content, title) {

      const db = getDatabase();
      let date = getDate()

      push(ref(db, 'comments'), {
        content: commentContent,
        title: commentTitle,
        date: date,
        display_name: user.providerData[0].displayName,
        thumbs_up: 0,
        movie_id: id,
        uid: user.uid 
      });
    }
    writeUserData()
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
  let IMDB = ''
  let tomatoes = ''
  let Metacritic = ''
  if (rating) {
    for(let i = 0; i < rating.length; i++) {
      if (rating[i].Source === 'Internet Movie Database') {
        IMDB = rating[i].Value
      }
      if (rating[i].Source === 'Rotten Tomatoes') {
        tomatoes = rating[i].Value
      }
      if (rating[i].Source === 'Metacritic') {
        Metacritic = rating[i].Value
      }
    }
  }

  return (
    <div style={{ 
      backgroundColor: `#1C1C1C` ,color: 'white'
    }}>
      {movie.poster_path && 
      <Container style={{ 
            backgroundImage: `linear-gradient(to top, #1C1C1C, ${backgroundMask}), url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")` //https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.svg
          }}>
      <Wrapper>
        <LeftContainer>
        {/* <BackGroundContainer >
          </BackGroundContainer> */}
          <Movie height="90%" plusMargin="17%" ratingMargin="60px" key={movie.id} imgUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} id={movie.id}/>
          {/* <PosterContainer style={{ 
            backgroundImage: `url("https://image.tmdb.org/t/p/w500${movie.poster_path}")` 
          }}>
          </PosterContainer> */}
        </LeftContainer>
        <RightContainer style={{ 
            color: `${colorStr}`
          }}>
          <h2>{movie.title}<Date>({movie.release_date.substr(0, 4)})</Date></h2>
          <p>{movie.overview}</p>
          {rating && <RatingList IMDB={IMDB} tomatoes={tomatoes} Metacritic={Metacritic}></RatingList>}
          <MovieDetailContent>
            {director && <li>導演：{director.name}</li>}
            <li>片長：{movie.runtime}</li>
            <li>官方網站：{movie.homepage}</li>
            <li>關鍵字：{movie.keywords.keywords.map((item) => {
              return <Keyword style={{ border: `1px solid ${colorStr}`}}>{'#'+item.name}</Keyword>
            })}</li>
          </MovieDetailContent>


        </RightContainer>
        
      </Wrapper>
      <h2>相關圖片：</h2>
      <MovieImgSection>
        
            {images && images.map((item) => {
              return <MovieImg style={{ 
                backgroundImage: `url("https://image.tmdb.org/t/p/original${item.file_path}")`
              }}></MovieImg>
            })}
          </MovieImgSection>
      <MovieVideoSection>
        <p>預告：</p>
          {video && <iframe width="1080" height="315" src={`https://www.youtube.com/embed/${video.key}?autoplay=1`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>}
          </MovieVideoSection>
      </Container>}
      <h2>Credits</h2>
      <Credits credits={credits}></Credits>
      <h2>Comments</h2>
      <CommentSection>
          {comments.length !== 0 ? comments.map((item, index) => {
            // console.log(item)
            return <Comment handleCommentOpen={handleCommentOpen} comment={item} />
          }) : <p>還沒有任何評論</p>}
          {user ? <button onClick={() => {setisCommentInputOpen(!isCommentInputOpen)}}>新增評論</button> : <Link to="/login">點我登入評論</Link>}
          
          {isCommentInputOpen && 
            <div>
              標題: <input type="text" onChange={(e) => setcommentTitle(e.target.value)}/><br />
              內容: <textarea type="text" onChange={(e) => setcommentContent(e.target.value)} />
              <input type="submit" onClick={handleCommentSubmit}></input>
            </div>
          }
      </CommentSection>
      <h2>推薦專區</h2>
      <Recommendations>

        <CarouselConatiner>
          <Carousel cols={3} gap={10}>
            {recommendations.map((item, index) =>
              <Carousel.Item key={item.id}>
                <div>
                {item.poster_path && <ImgContainer style={{ 
                  backgroundImage: `url("https://image.tmdb.org/t/p/w500${item.poster_path}")` 
                }} to={`/movie/${item.id}`}>
                </ImgContainer>}
                </div>

              </Carousel.Item>        
            )}
            </Carousel>
          </CarouselConatiner>
      </Recommendations>
    </div>


  )
}