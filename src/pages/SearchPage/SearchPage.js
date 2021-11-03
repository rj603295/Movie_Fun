import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import {
  getGenre,
  getSearchData,
  getIMDBID,
  getMovieRating
} from '../../WebAPI'
import Movie from '../../components/Movie'
import Person from '../../components/Person'
import RatingList from '../../components/Rating'
import Loading from '../../components/Loading'

const Container = styled.div`
  background: #1C1C1C;
  line-height: 1.5;
  color: white;
  padding-top: 8%;
  min-height: 100vh;
  @media (max-width: 415px) {
    display: block;
    padding-top: 15%;
  }
`
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  @media (max-width: 415px) {
    display: block;
  }
`
const ResultContainer = styled.div`
  width: 100%;
  @media (max-width: 415px) {
    margin-top: 15%;
  }
`
const MovieContainer = styled.div`
  border: 1px solid;
  margin: 20px auto;
  display: grid;
  grid-template-columns: 30% 70%;
  align-items: center;
  max-width: 90%;
  @media (max-width: 415px) {
    max-width: 90%;
    grid-template-columns: 40% 60%;
  }
`
const ContentContainer = styled.div`
  margin: 0 auto;
  padding: 8%;
  font-size: 0.5rem;
  li{
    list-style: none;
  }
  .rating-list{
    margin-top: 5%;
  }
  .RWD-S{
    display: none;
  }
  p{
    display: -webkit-box;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
    white-space: normal;
    text-align: justify;
  }
  @media (max-width: 900px) {
    p{
      display: -webkit-box;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      white-space: normal;
      font-size: 1rem;
    }
    h2{
      font-size: 2rem;
    }
  }
  @media (max-width: 415px) {
    .RWD-L{
      display: block;
    }
    padding: 0px 5%;
    h2{
      font-weight: bold;
    }

  }
`
const ClassificationList = styled.div`
  margin: 0 auto;
  min-width: 80%;
  margin-top: 10%;
  font-size: 0.5rem;
  @media (max-width: 415px) {
    display: none;
  }
 
`
const PageContainer = styled.div`

`
const ItemContainer = styled.div`
  width: 100%;
  margin: 1%;
  .RWD-S{
    display: none;
  }
  @media (max-width: 415px) {
    .RWD-S{
      display: block;
    }
    .RWD-L{
      display: none;
    }
    img{
      height: 200px;
    }
  }
`
const NotFoundMessage = styled.p`
  color: white;
  text-align: left;
  margin-top: 5%;
  @media (max-width: 415px) {
    text-align: center;
  }
`
const Filter = styled.li`
  ${(props) => props.$active &&
    `
      background: white;
      color: black;
    `}
  list-style: none;
  padding-left: 0;
  width: 100%;
  padding: 5% 0;
  border: 1px solid white;
  cursor: pointer;
`
function People ({ person }) {
  return (
    <MovieContainer>
      <Person isName={ false } person={ person } />
      <ContentContainer>
        <h2>{person.name}</h2>
        <p>代表作: {person.known_for.map((item, index) => {
          return <li key={ index }>{item.title}</li>
        })}</p>
      </ContentContainer>
    </MovieContainer>
  )
}
function SearchMovie ({ movie, rating }) {
  // let imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  return (
    <MovieContainer>
      <ItemContainer>
        <div className="RWD-L">
          <Movie id={ movie.id } imgUrl={ `https://image.tmdb.org/t/p/w500${movie.poster_path}` } isRating={ false } key={ movie.id } movie={ movie } rating={ rating } />
        </div>
        <div className="RWD-S">
          <Movie id={ movie.id } imgUrl={ `https://image.tmdb.org/t/p/w500${movie.poster_path}` } isRating={ false } key={ movie.id } movie={ movie } rating={ rating } />
        </div>

      </ItemContainer>
      <ContentContainer>
        <h2>{movie.title}</h2>
        <p>{movie.overview}</p>
        <div className="RWD-S"></div>
        <div className="rating-list"><RatingList Ratings={ rating } logoWidth="30px" /></div>
      </ContentContainer>
    </MovieContainer>
  )
}

export default function SearchPage () {
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
  const [totalPage, setTotalPage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { query } = useParams()

  useEffect(() => {
    if (query !== '') {
      window.scrollTo(0, 0)
      setRating([])
      setMovies([])
      getSearchData(query).then((res) => {
        setCurrentPage(res.page)
        setTotalPage(res.total_pages)
        let movieCount = 0
        let peopleCount = 0
        const genreArr = []
        res.results.forEach((item) => {
          if (item.media_type === 'movie') {
            item.genre_ids.forEach((genreID) => {
              const isFind = genreArr.find((itemID) => itemID === genreID)
              if (!isFind) {
                genreArr.push(genreID)
              }
            })
          }

          if (item.media_type === 'movie') {
            return movieCount++
          }
          if (item.media_type === 'tv') {
            return null
          }
          if (item.media_type === 'person') {
            return peopleCount++
          }
        })
        const allCount = movieCount + peopleCount
        setsearchItemGenreID(genreArr)
        setMovies(res.results.sort((a, b) => {
          return b.popularity - a.popularity
        }))
        settypesCount({
          allCount,
          movieCount,
          peopleCount
        })
      })
    }
  }, [query])

  // 取得搜尋電影的評分
  useEffect(() => {
    setRating([])
    let arr = []
    // const arr2 = []
    function getSearchMovieRating () {
      const IMDBIDArr = []
      const ratingArr = []
      for (let i = 0; i < movies.length; i++) {
        if (movies[i].media_type === 'movie') {
          IMDBIDArr.push(getIMDBID(movies[i].id))
        } else {
          IMDBIDArr.push(null)
        }
      }
      Promise.all(IMDBIDArr).then((res) => {
        arr = Object.assign([], res)
        for (let i = 0; i < arr.length; i++) {
          ratingArr.push(getMovieRating(arr[i].imdb_id))
        }
      }).then(() => {
        Promise.all(ratingArr).then((res) => {
          setRating(res)
          setIsLoading(false)
        }).catch((err) => {
          setIsLoading(false)
          return err
        })
      }).catch((err) => {
        setIsLoading(false)
        return err
      })
      // for (let i = 0; i < movies.length; i++) {
      //   if (movies[i].media_type === 'movie') {
      //     await getIMDBID(movies[i].id).then((res) => {
      //       arr.push(res.imdb_id)
      //     })
      //   } else {
      //     arr.push(null)
      //   }
      // }
      // for (let i = 0; i < arr.length; i++) {
      //   await getMovieRating(arr[i]).then((res) => {
      //     arr2.push(res.Ratings)
      //     const a = res.Ratings
      //     setRating(prevCount => [...prevCount, a])
      //   })
      // }
    }
    getSearchMovieRating()
  }, [movies])

  useEffect(() => {
    getGenre().then((res) => {
      const genreArr = []
      const arr2 = []
      for (let i = 0; i < res.genres.length; i++) {
        genreArr.push(res.genres[i])
      }
      for (let i = 0; i < searchItemGenreID.length; i++) {
        const id = genreArr.find((item) => {
          return item.id === searchItemGenreID[i]
        })
        arr2.push(id)
      }
      setGenre(arr2)
    })
  }, [searchItemGenreID])
  const handleCurrentType = (e) => {
    if (e.target.nodeName === 'LI') {
      if (e.target.dataset.value === '0') {
        setCurrentType(0)
      }
      if (e.target.dataset.value === '1') {
        setCurrentType(1)
      }
      if (e.target.dataset.value === '2') {
        setCurrentType(2)
      }
      if (e.target.dataset.value === '3') {
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
    window.scrollTo(0, 0)
    getSearchData(query, page).then((res) => {
      setCurrentPage(res.page)
      setTotalPage(res.total_pages)
      let movieCount = 0
      let peopleCount = 0
      const genreArr = []
      res.results.forEach((item) => {
        if (item.media_type === 'movie') {
          item.genre_ids.forEach((genreID) => {
            const isFind = genreArr.find((itemID) => itemID === genreID)
            if (!isFind) {
              genreArr.push(genreID)
            }
          })
        }

        if (item.media_type === 'movie') {
          return movieCount++
        }
        if (item.media_type === 'tv') {
          return
        }
        if (item.media_type === 'person') {
          return peopleCount++
        }
      })
      const allCount = movieCount + peopleCount
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
      <Loading isLoading={ isLoading } />
      <Wrapper>
        <ClassificationList>
          <ul onClick={ (e) => { handleCurrentType(e) } }>
            <Filter $active={ currentType === 0 } data-value="0">全部 {typesCount.allCount}</Filter>
            <Filter $active={ currentType === 1 } data-value="1">電影 {typesCount.movieCount}</Filter>
            <Filter $active={ currentType === 2 } data-value="2">人物 {typesCount.peopleCount}</Filter>
            <Filter $active={ currentType === 3 } onClick={ handleisTypeListOpen }>類型</Filter>
            {genres && isTypeListOpen &&
            genres.map((genre) => {
              return <li className="genre-DDL" data-value="3" key={ genre.id } onClick={ (e) => { handleCurrentGenre(e) } } value={ genre.id }>{genre.name}</li>
            })}
          </ul>
        </ClassificationList>
        <ResultContainer>
          {rating.length !== 0 && movies.length !== 0 && currentType === 0 &&
        movies.map((item, index) => {
          if (item.media_type === 'movie') {
            return <SearchMovie key={ item.id } movie={ item } rating={ rating[index].Ratings } />
          }
          if (item.media_type === 'person') {
            return <People key={ item.id } person={ item } />
          }
          return null
        }) }
          {rating.length !== 0 && movies && currentType === 1 && typesCount.movieCount !== 0 &&
          movies
            .filter((item) => {
              return item.media_type === 'movie'
            })
            .map((item, index) => {
              return <SearchMovie key={ item.id } movie={ item } rating={ rating[index].Ratings } />
            })
        }
          {movies && currentType === 2 && typesCount.peopleCount !== 0 &&
          movies
            .filter((item) => {
              return item.media_type === 'person'
            })
            .map((item) => {
              return <People key={ item.id } person={ item } />
            })
        }
          {rating.length !== 0 && movies && currentType === 3 && typesCount.allCount !== 0 &&
          movies
            .filter((item) => {
              return item.media_type === 'movie'
            })
            .filter((item) => {
              let genreFilter = false
              item.genre_ids.some((genre) => {
                genreFilter = (genre === currentGenre)
                return genreFilter
                // return genre === currentGenre ? genreFilter = true : genreFilter = false
              })
              return genreFilter === true
            })
            .map((item, index) => {
              return <SearchMovie key={ item.id } movie={ item } rating={ rating[index].Ratings } />
            })
        }
          {movies.length === 0 && <NotFoundMessage>找不到任何搜尋結果</NotFoundMessage>}
        </ResultContainer>
      </Wrapper>
      <PageContainer>
        {currentPage !== 1 ? <button onClick={ () => { handlePageChange(currentPage - 1) } }>&lt;</button> : ''}
        {currentPage}
        {currentPage !== totalPage && totalPage !== 0 ? <button onClick={ () => { handlePageChange(currentPage + 1) } }>&gt;</button> : ''}
      </PageContainer>
    </Container>

  )
}
