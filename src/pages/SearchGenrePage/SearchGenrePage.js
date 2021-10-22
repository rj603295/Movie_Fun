import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import {
  getGenreSearch,
  getGenre,
  getIMDBID,
  getMovieRating
} from '../../WebAPI'
import Loading from '../../components/Loading'
import Movie from '../../components/Movie'

const Container = styled.div`
  background: #1C1C1C;
  padding-top: 80px;
`
const ResultContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  justify-content: center;
  .RWD-S{
    display: none;
  }
  @media (max-width: 415px) {
    .RWD-L{
      display: none;
    }
    .RWD-S{
      display: block;
    }
  }

`
const TypeTitle = styled.h2`
    padding: 60px 0px;
    color: white;
`
const PageContainer = styled.div`
    color: white;
    padding: 30px 0px;
`
const ItemContainer = styled.div`
  width: 23%;
  margin: 1%;
  @media (max-width: 415px) {
    width: 45%;
  }
`
export default function SearchGenrePage () {
  const [movies, setMovies] = useState([])
  const [genres, setGenre] = useState([])
  const [Rating, setRating] = useState([])
  const [currentPage, setCurrentPage] = useState('')
  const [totalPage, setTotalPage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRatingLoading, setIsRatingLoading] = useState(Array(20).fill(true))
  // const isRatingLoading = useRef(Array(20).fill(true))
  const { id } = useParams()
  // 拿到此類型的電影集
  useEffect(() => {
    if (id !== '') {
      getGenreSearch(id).then((res) => {
        setIsLoading(true)
        setCurrentPage(res.page)
        setTotalPage(res.total_pages)
        setMovies(res.results)
        setIsLoading(false)
      })
    }
  }, [id])
  // 取得此類型電影集評分
  useEffect(() => {
    const arr = []
    const arr2 = []
    async function getMoviesRatings () {
      // setIsLoading(true)
      for (let i = 0; i < movies.length; i++) {
        await getIMDBID(movies[i].id).then((res) => {
          arr.push(res.imdb_id)
        }).catch(() => {
          arr.push(null)
        })
      }
      for (let i = 0; i < arr.length; i++) {
        await getMovieRating(arr[i]).then((res) => {
          arr2.push(res.Ratings)
          const a = res.Ratings
          setRating(prevCount => [...prevCount, a])

          setIsRatingLoading(prev => prev.map((item, index) => {
            if (index !== i) return item
            return false
          }))
          // isRatingLoading.current[i] = false
          // Sconsole.log(`${i}`,isRatingLoading.current[i])
        }).catch(() => {
          setRating(prevCount => [...prevCount, []])
        })
      }
      // setRating(arr2)
    }
    getMoviesRatings()
  }, [movies])

  useEffect(() => {
    getGenre().then((res) => {
      const genreArr = []
      for (let i = 0; i < res.genres.length; i++) {
        genreArr.push(res.genres[i])
      }
      setGenre(genreArr)
    })
  }, [])
  const handlePageChange = (page) => {
    window.scrollTo(0, 0)
    setIsLoading(true)
    setRating([])
    setIsRatingLoading(Array(20).fill(true))
    if (id !== '') {
      getGenreSearch(id, page).then((res) => {
        setCurrentPage(res.page)
        setMovies(res.results)
      })
    }
    setIsLoading(false)
  }
  return (
    <Container>
      <Loading isLoading={ isLoading } />
      <TypeTitle>
        {genres
          .filter((item) => {
            return item.id.toString() === id
          })
          .map((item) => {
            return item.name + '類型搜尋結果'
          })
        }
      </TypeTitle>
      <ResultContainer>
        {movies && movies.map((item, index) => {
          return <ItemContainer className="RWD-L" key={ item.id } ><Movie isRating isRatingLoading={ isRatingLoading[index] } movie={ item } rating={ Rating[index] } /></ItemContainer>
        })}
        {movies && movies.map((item, index) => {
          return <ItemContainer className="RWD-S" key={ item.id } ><Movie isRating isRatingLoading={ isRatingLoading[index] } movie={ item } rating={ Rating[index] } /></ItemContainer>
        })}
      </ResultContainer>
      <PageContainer>
        {currentPage !== 1 ? <button onClick={ () => { handlePageChange(currentPage - 1) } }>&lt;</button> : ''}
        {currentPage}
        {currentPage !== totalPage ? <button onClick={ () => { handlePageChange(currentPage + 1) } }>&gt;</button> : ''}
      </PageContainer>
    </Container>

  )
}
