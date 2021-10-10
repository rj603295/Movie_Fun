import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { 
  getPopular, 
  getMovieRating, 
  getIMDBID, 
  getTrend, 
  getGenre, 
  getUpcomming, 
  getPopularPeople
} from '../../WebAPI'
import {
  getDatabase,
  ref,
  query,
  orderByValue,
  onValue,
  limitToFirst
} from 'firebase/database'
import Carousel from '../../components/Carousel'
import RatingList from '../../components/Rating'
import Movie from '../../components/Movie'
import Person from '../../components/Person'
import Loading from '../../components/Loading'
import Comment from '../../components/Comments'

const Title = styled.h2`
  font-size: 5rem;
  color: rgb(224, 222, 222);
  margin: 0;
  padding: 3% 0;
}
`
const MovieContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  z-index: 999;
  top: 70%;
  height: 100%;
  .RWD-S{
    display: none;
  }
  @media (max-width: 415px) {
    top: 0;
    height: 60%;
    .RWD-S{
      display: block;
    }
    .RWD-L{
      display: none;
    }
  }
`
const ImgContainer = styled(Link)`
  display: flex;
  height: auto;
  width: 100%;
  padding: 70% 0;
  align-items: end;
  justify-content: end;
  margin-right: 10px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  @media (max-width: 415px) {
    
  }
`
const CarouselConatiner = styled.div`
  max-width: 95%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #1C1C1C;
  .RWD-S{
    display: none;
  }
  @media (max-width: 415px) {
    top: 0;
    height: 60%;
    .RWD-S{
      display: block;
    }
    .RWD-L{
      display: none;
    }
  }
`
const Section = styled.div`
  position: relative;
`
const RecommendationSection = styled.div`
  height:100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  width: 100vw;
  @media (max-width: 415px) {
    width: 100%;
  }
`
const Recommedation = styled.div`
  color: white;
  position: absolute;
  top: 30%;
  left: 10%;
  @media (max-width: 415px) {
    top:60%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
  }
`
const RecommendationTitle = styled.h2`
  font-size: 2rem;
  text-align: left;
  margin-bottom: 1%;
  @media (max-width: 415px) {
    text-align: center;
    font-size: 4rem;
  }
`
const RecommedationContent = styled.p`
  text-align: left;
  font-size: 0.5rem;
  width: 50%;
  margin-bottom: 1%;
  line-height: 1.5;
  @media (max-width: 415px) {
    display: none;
  }
`
const RecommedationRating = styled.div`
  width: 50%;
  @media (max-width: 415px) {
    margin: 0 auto;
  }
`
const PopularSection = styled.div`
  position: relative;

  .RWD-S{
    display: none;
  }
  @media (max-width: 415px) {
    min-height: 200px;
    .RWD-L{
      display: none;
    }
    .RWD-S{
      display: block;
    }
  }
`
const TypeSection = styled.div`
  color: white;
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  a{
    display: block;
    width: 16%;
    margin-right: 1%;
    margin-bottom: 1%;
    border: 1px solid white;
    padding: 2% 0px;
    box-sizing: border-box;
    border-radius: 8px;
    color: white;
    text-decoration: none;

    background-size: cover;
    background-position: center;
  }
  @media (max-width: 415px) {
    font-size: 14px;
    a{width: 27%;}
  }
 
`
const UpcommingSection = styled.div`

`
const SubTitle = styled.p`
  color: white;
`
const HotPeopleSection = styled.div`
  display: flex;
  justify-content: center;
`
const CreditName = styled.p`
  color: white;
  font-size: 0.5rem;
`
const HotCommentsSection = styled.div`
  color: white;
  padding-bottom: 20px;
  margin: 0 auto;
  margin-top: 40px;
  width: 60%;
  @media (max-width: 415px) {
    width: 85%;
  }
`
function Credits({ credits }) {
  return (
    <CarouselConatiner>
      <div className="RWD-L">
      <Carousel cols={6} gap={3}>
        {credits.map((item, index) =>
          <Carousel.Item key={item.id}>
          {item.profile_path !== "null" && 
            <div>
              <Person person={item}/>
            </div>}
          </Carousel.Item>        
        )}
      </Carousel>
      </div>
      <div className="RWD-S">
      <Carousel cols={3} gap={3}>
        {credits.map((item, index) =>
          <Carousel.Item key={item.id}>
          {item.profile_path !== "null" && 
            <div>
              <Person person={item}/>
            </div>}
          </Carousel.Item>        
        )}
      </Carousel>
      </div>

    </CarouselConatiner>
  )
}
export default function HomePage() {
  const [movies, setMovies] = useState([])
  const [Rating, setRating] = useState([])
  const [trend, setTrend] = useState([])
  const [upcomming, setUpcomming] = useState([])
  const [upcommingRating, setUpcommingRating] = useState([])
  const [genres, setGenre] = useState([])
  const [hotPeople, setHotPeople] = useState([])
  const [hotComments, setHotComments] = useState([])
  const [hotCommentsKey, setHotCommentsKey] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const isRatingLoading = useRef(Array(20).fill(true))
  //初始化
  useEffect(() => {
    //取得首頁單一電影
    async function getFirstHotMovie() {
      let imdb_id = ''
      let trendData
      // setIsLoading(true)
      await getTrend().then((res) => {
        let data = res.results.sort(function(a,b){
          return b.popularity - a.popularity
        });
        setTrend(data[0])
        trendData = data[0]
      })
      await getIMDBID(trendData.id).then((res) => {
        imdb_id = res.imdb_id
      })
      await getMovieRating(imdb_id).then((res) => {
        let ratingArr = res.Ratings
        setTrend(prevState => ({
          ...prevState,
          Ratings: ratingArr
        }))
      })
    }
    getFirstHotMovie()
    //取得熱門電影前20名
    getPopular().then((data) => {
      setMovies(data.results)
    })
    //取得即將上映20部電影
    getUpcomming().then((data) => {
      setUpcomming(data.results)
    })
    //取得熱門演員前20名
    getPopularPeople().then((data) => {
      setHotPeople(data.results)
    })
    //取得各種類型
    getGenre().then((res) => {
      let genreArr = []
      for(let i = 0; i < res.genres.length; i++) {
        genreArr.push(res.genres[i])
      }
      setGenre(genreArr)
    })
    //取得熱門評論
    const db = getDatabase();
    const mostThumbsUpPosts = query(ref(db, 'comments'), orderByValue('thumbs_up'), limitToFirst(3))
    let keyArr = []
    onValue(mostThumbsUpPosts, (snapshot) => {
      const data = snapshot.val()
      keyArr = Object.keys(data)
      let arr = []
      for(let i = 0; i < keyArr.length; i++) {
        arr.push(
          {
            ...data[keyArr[i]], 
            isHide: true,
            id: keyArr[i]
          }
        )
      }
      setHotComments(arr)
      setHotCommentsKey(keyArr)
    });

  }, []);
//取得Popular movies分數
  useEffect(() => {
    // setIsLoading(true)
    let arr = []
    let arr2 = []
    async function getPopularMovieRating() {
      for(let i = 0; i < movies.length; i++) {
        await getIMDBID(movies[i].id).then((res) => {
          arr.push(res.imdb_id)
        })
      }
      for(let i = 0; i < arr.length; i++) {
        await getMovieRating(arr[i]).then((res) => {
          arr2.push(res.Ratings)
          isRatingLoading.current[i] = false
        })
      }
      setRating(arr2)
      // setIsLoading(false)
    }
    getPopularMovieRating().then(() => {setIsLoading(false)})

  }, [movies])

  const handleCommentOpen = (id) => {
    setHotComments(hotComments.map((item) => {
      if (item.id !== id) return item
      return {
        ...item,
        isHide: !item.isHide
      }
    }))
  }

  return (
    <div style={{ backgroundColor: `#1C1C1C` }}>
      <Loading isLoading={isLoading} />
      <Section>
        <RecommendationSection style={{ 
            backgroundImage: trend.backdrop_path && `linear-gradient(to top, #1C1C1C, transparent), url("https://image.tmdb.org/t/p/original${trend.backdrop_path}")` 
          }}>
          <Recommedation>
            <RecommendationTitle>{trend.title}</RecommendationTitle>
            <RecommedationContent>{trend.overview}</RecommedationContent>
            <RecommedationRating>{trend.Ratings && <RatingList key={trend.id} Ratings={trend.Ratings} />}</RecommedationRating>
          </Recommedation>
        </RecommendationSection>
        <PopularSection className="popular">
          <Title>Popular</Title>
          <MovieContainer>
          <CarouselConatiner>
            <div className="RWD-L">
            <Carousel cols={4} gap={20}>
              {movies.map((movie, index) =>
                <Carousel.Item style={{width: "30%"}}>
                  <Movie
                  key={movie.id}
                  movie={movie}
                  imgUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  rating={Rating[index]}
                  id={movie.id}
                  isRating={true}
                  isRatingLoading={isRatingLoading.current[index]} />
                </Carousel.Item>        
              )}
              </Carousel>
            </div>
            <div className="RWD-S">
            <Carousel cols={2} gap={10}>
              {movies.map((movie, index) =>
                <Carousel.Item>
                  <Movie
                  key={movie.id}
                  movie={movie}
                  imgUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  rating={Rating[index]}
                  id={movie.id}
                  isRating={true} />
                </Carousel.Item>        
              )}
              </Carousel>
            </div>
            </CarouselConatiner>
          </MovieContainer>
        </PopularSection>
        <Title>Upcomming</Title>
        <SubTitle>台灣及全美即將上映</SubTitle>
        <UpcommingSection>
          <MovieContainer>
            <CarouselConatiner>
            <div className="RWD-L">
              <Carousel cols={4} gap={10}>
                {upcomming.map((movie, index) =>
                  <Carousel.Item>
                    <Movie
                    key={movie.id}
                    movie={movie}
                    imgUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    rating={upcommingRating[index]}
                    id={movie.id}/>
                  </Carousel.Item>        
                )}
              </Carousel>
              </div>
              <div className="RWD-S">
              <Carousel cols={2} gap={10}>
                {upcomming.map((movie, index) =>
                  <Carousel.Item>
                    <Movie
                    key={movie.id}
                    movie={movie}
                    imgUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    rating={upcommingRating[index]}
                    id={movie.id}/>
                  </Carousel.Item>        
                )}
              </Carousel>
              </div>
            </CarouselConatiner>
          </MovieContainer>
        </UpcommingSection>
        <Title>Hottest</Title>
        <HotPeopleSection>
          <Credits credits={hotPeople}></Credits>
        </HotPeopleSection>
        <Title>Genre</Title>
        <SubTitle>尋找您喜歡的類型</SubTitle>
        <TypeSection >
          {genres.map((genre) => {
            return <Link key={genre.id} to={`/search/genre/${genre.id}`}><li>{genre.name}</li></Link>
          })}
        </TypeSection>
        <Title>Comments</Title>
        <HotCommentsSection>
        {hotComments.length !== 0 ? hotComments.map((item, index) => {
           return <Comment key={item.id} comment={item} handleCommentOpen={handleCommentOpen} isPosterOpen={true} />
          }) : <p>還沒有任何評論</p>}
        </HotCommentsSection>
      </Section>


    </div>

  )
}