import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useHistory, useParams } from 'react-router-dom'
import {
  getGenre,
  getSearchData,
  getIMDBID,
  getMovieRating,
} from '../../WebAPI'
import Movie from '../../components/Movie'

const Container = styled.div`
  background: #1C1C1C;
  display: grid;
  grid-template-columns: 20% 80%;
  color: white;
  padding-top: 80px;

`
const ResultContainer = styled.div`

`
const MovieContainer = styled.div`
  border: 1px solid;
  margin: 20px auto;
  display: grid;
  grid-template-columns: 30% 70%;
  // grid-gap: 0px 0px;
  align-items: center;
  max-width: 70%
`
const ImgContainer = styled.div`
  width:fit-content;
  height: fit-content;
    img{
      height: 400px;
    }
`
const ContentContainer = styled.div`
  padding-right: 40px;
`
const TypeList = styled.div`

   
`
const ClassificationList = styled.div`
  li{
    list-style: none;
    padding: 10px 5px;
    border: 1px solid white;
    cursor: pointer;
    ${(props) => props.$active &&
      `
        color: yellow
      `}
  }
 
`
const PageContainer = styled.div`

`
const ItemContainer = styled.div`
  width: 100%;
  margin: 1%;
`
function People ({ person }) {
  console.log('person', person)
  let imgUrl = `https://image.tmdb.org/t/p/w500${person.profile_path}`
  return(
    <MovieContainer>
      <ImgContainer>
      <Link to={`/movie/${person.id}`}>
        <img src={imgUrl} />
      </Link>
      </ImgContainer>
      <ContentContainer>
        <h2>{person.name}</h2>
        <p>代表作: {person.known_for.map((item) => {
          return <li>{item.title}</li>
        })}</p>
        {/* <p>{person.overview}</p> */}
      </ContentContainer>
    </MovieContainer>
  )
}
function SearchMovie ({ movie, rating }) {
  //let imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  return(
    <MovieContainer>
      <ItemContainer>
        <Movie key={movie.id} id={movie.id} imgUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} rating={rating}  isRating={true}/>
      </ItemContainer>
      <ContentContainer>
        <h2>{movie.title}</h2>
        <p>{movie.overview}</p>
      </ContentContainer>
    </MovieContainer>
  )
}

export default function SearchPage() {
  const history = useHistory()
  const [movies, setMovies] = useState([])
  const [genres, setGenre] = useState([])
  const [rating, setRating] = useState([])
  const [searchItemGenreID, setsearchItemGenreID] = useState([])
  const [currentType, setCurrentType] = useState(0)
  const [typesCount, settypesCount] = useState({
    allCount: 0,
    movieCount: 0,
    peopleCount: 0
  })
  const [isTypeListOpen, setIsTypeListOpen] = useState(false)
  const [currentGenre, setCurrentGenre] = useState(0)
  const [currentPage, setCurrentPage] = useState('')
  const { query } = useParams()

  useEffect(() => {
    if(query !== '' ) {
      getSearchData(query).then((res) => {
        setCurrentPage(res.page)
        console.log('res',res)
        let movieCount = 0
        let peopleCount = 0
        let genreArr = []
        res.results.map((item) => {
          if(item.media_type === 'movie') {
            item.genre_ids.map((genreID) => {
              const isFind = genreArr.find((itemID) => itemID === genreID)
               if(!isFind) {
                 genreArr.push(genreID)
                } 
              })
          }

          if(item.media_type === 'movie'){
            return movieCount ++
          }
          if(item.media_type === 'tv') {
            return 
          }
          if(item.media_type === 'person') {
            return peopleCount ++
          }
        })
        let allCount = movieCount + peopleCount
        setsearchItemGenreID(genreArr)
       setMovies(res.results)
       settypesCount({
         allCount,
         movieCount,
         peopleCount
       })
      })
    }
  }, [query])

  //取得搜尋電影的評分
  useEffect(() => {

      let arr = []
      let arr2 = []
      async function getSearchMovieRating() {

        for(let i = 0; i < movies.length; i++) {
          if(movies[i].media_type === 'movie') {
            await getIMDBID(movies[i].id).then((res) => {
              arr.push(res.imdb_id)
            })
          } else {
            arr.push(null)
          }
        }
        for(let i = 0; i < arr.length; i++) {
          await getMovieRating(arr[i]).then((res) => {
            arr2.push(res.Ratings)
          })
        }
        setRating(arr2)
        //setIsLoading(false)
      }
      getSearchMovieRating().then(() => {})
  }, [movies])

  useEffect(() => {
    getGenre().then((res) => {
      let genreArr = []
      let arr2 = []
      for(let i = 0; i < res.genres.length; i++) {
        genreArr.push(res.genres[i])
      }
      for(let i = 0; i< searchItemGenreID.length; i++) {
        let id = genreArr.find((item) => {
          return item.id === searchItemGenreID[i]
        })
        arr2.push(id)
      }
      setGenre(arr2)
    })
  }, [searchItemGenreID])
  const handleTypeChange = (id) => {
    history.push(`/search/genre/${id}`)
  }
  const handleCurrentType = (e) => {
    console.log(e.target.dataset.value)
    if(e.target.nodeName === 'LI') {
      if(e.target.dataset.value === '0') {
        setCurrentType(0)
      }
      if(e.target.dataset.value === '1') {
        setCurrentType(1)
      }
      if(e.target.dataset.value === '2') {
        setCurrentType(2)
      }
      if(e.target.dataset.value === '3') {
        setCurrentType(3)
      }

    }
  }
  const handleisTypeListOpen = () => {
    setIsTypeListOpen(!isTypeListOpen)
  }
  const handleCurrentGenre = (e) => {
    setCurrentGenre(e.target.value)
  }
  const handlePageChange = (page) => {

    getSearchData(query, page).then((res) => {
      setCurrentPage(res.page)
      console.log('res',res)
      let movieCount = 0
      let peopleCount = 0
      let genreArr = []
      res.results.map((item) => {
        if(item.media_type === 'movie') {
          item.genre_ids.map((genreID) => {
            const isFind = genreArr.find((itemID) => itemID === genreID)
             if(!isFind) {
               genreArr.push(genreID)
              } 
            })
        }

        if(item.media_type === 'movie'){
          return movieCount ++
        }
        if(item.media_type === 'tv') {
          return 
        }
        if(item.media_type === 'person') {
          return peopleCount ++
        }
      })
      let allCount = movieCount + peopleCount
      setsearchItemGenreID(genreArr)
     setMovies(res.results)
     settypesCount({
       allCount,
       movieCount,
       peopleCount
     })
    })
  }
  return (
    <Container>
      <ClassificationList>
        <ul onClick={(e) => {handleCurrentType(e)}}>
          <li $active={currentType === 0} data-value="0">全部 {typesCount.allCount}</li>
          <li $active={currentType === 0} data-value="1">電影 {typesCount.movieCount}</li>
          <li $active={currentType === 1} data-value="2">人物 {typesCount.peopleCount}</li>
          <li $active={currentType === 2} onClick={handleisTypeListOpen}>類型</li>
          {genres && isTypeListOpen &&
            genres.map((genre) => {
              return <li className="genre-DDL" data-value="3" value={genre.id} onClick={(e) => {handleCurrentGenre(e)}}>{genre.name}</li>
          })}
        </ul>
      </ClassificationList>
      <ResultContainer>
      <TypeList>

      </TypeList>
      {movies && currentType === 0 && 
        movies.map((item, index) => {
          if(item.media_type === 'movie') {
            return <SearchMovie key={item.id} movie={item} rating={rating[index]} /> 
          }
          if(item.media_type === 'person') {
            return <People key={item.id} person={item}/>
          } 

        }) }
        {movies && currentType === 1 && typesCount.movieCount !== 0 && 
          movies
            .filter((item) => {
              return item.media_type === 'movie'
            })
            .map((item, index) => {
              return <SearchMovie key={item.id} movie={item} rating={rating[index]}/>
          })
        }
        {movies && currentType === 2 && typesCount.peopleCount !== 0 && 
          movies
            .filter((item) => {
              return item.media_type === 'person'
            })
            .map((item) => {
              return <People key={item.id} person={item}/>
            }) 
        }
        {movies && currentType === 3 && typesCount.allCount !== 0 && 
          movies
            .filter((item) => {
              return item.media_type === 'movie'
            })
            .filter((item) => {
              let genreFilter = false
              //item.genre_id.find((genre) => genre === currentGenre)
              item.genre_ids.some((genre) => {
                return genre === currentGenre ? genreFilter = true : genreFilter = false
              })
              return genreFilter === true
            })
            .map((item, index) => {
              return <SearchMovie key={item.id} movie={item} rating={rating[index]}/>
          })
        }
      </ResultContainer>
      <PageContainer>
        <button onClick={() => {handlePageChange(currentPage - 1)}}>上一頁</button>
         {currentPage}
         <button onClick={() => {handlePageChange(currentPage + 1)}}>下一頁</button>
      </PageContainer>
    </Container>

  )
}