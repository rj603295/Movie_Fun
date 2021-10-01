import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Link, useHistory, useParams } from 'react-router-dom'
import {
  getGenreSearch,
  getGenre,
  getIMDBID,
  getMovieRating
} from '../../WebAPI'
import RatingLoading from '../../components/RatingLoading'
import Loading from '../../components/Loading'
import Movie from '../../components/Movie'
// import RatingList from './Rating'
const Container = styled.div`
  background: #1C1C1C;
  padding-top: 80px;
`
const ResultContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  justify-content: center;
`
const MovieContainer = styled(Link)`
  display: flex;
  width: 22%;
  align-items: end;
  justify-content: end;
  margin: 20px 3px;
  height: 400px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  box-sizing: border-box;
`
const TypeTitle = styled.h2`
    padding: 20px 0px;
    color: white;
`
const PageContainer = styled.div`
    color: white;
    padding: 30px 0px;
`
const RatingList = styled.div`
    text-align: left;
    background: white;
    color: black;
    list-style: none;
    border-radius: 5px;
    border: 3px solid grey;
    font-size: 10px;
    font-weight: bold;
    position: relative;
`
const ItemContainer = styled.div`
  width: 23%;
  margin: 1%;
`
// function Movie ({ movie, rating, isLoading }) {
//   let IMDB = ''
//   let tomatoes = ''
//   let Metacritic = ''
//   if (rating) {
//     // console.log(rating)
//     for(let i = 0; i < rating.length; i++) {
//       if (rating[i].Source === 'Internet Movie Database') {
//         IMDB = rating[i].Value
//       }
//       if (rating[i].Source === 'Rotten Tomatoes') {
//         tomatoes = rating[i].Value
//       }
//       if (rating[i].Source === 'Metacritic') {
//         Metacritic = rating[i].Value
//       }
//     }
//   }
//   let imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//   return(
//     // <Link style={{ display: 'block', width: '22%'}} to={`/movie/${movie.id}`}>
//       <MovieContainer style={{ backgroundImage: `url("${imgUrl}")`}} to={`/movie/${movie.id}`}>

//       <div className="poster_rating_section2" style={{ 
//             color: `white`, maringRight: '50px'
//           }}>
//     {rating && 
    
//     <RatingList>
//       <RatingLoading isLoading={isLoading} />
//       <li><img className="logo I_logo" src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="" /> {IMDB !== '' ? IMDB : 'No Data'}</li>
//       <li><img className="logo T_logo" src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Rotten_Tomatoes_logo.svg" alt="" /> {tomatoes  !== '' ? tomatoes : 'No Data'}</li>
//       <li><img className="logo M_logo" src="https://upload.wikimedia.org/wikipedia/commons/4/48/Metacritic_logo.svg" alt="" /> {Metacritic  !== '' ? Metacritic : 'No Data'}</li>
//     </RatingList>}
//     </div>
//     </MovieContainer>
//   )
// }

export default function SearchGenrePage() {
  const history = useHistory()
  const [movies, setMovies] = useState([])
  const [genres, setGenre] = useState([])
  const [Rating, setRating] = useState([])
  const [currentPage, setCurrentPage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isRatingLoading = useRef(Array(20).fill(true))
  //Array(10).fill('ele');
  const { id } = useParams()
  //拿到此類型的電影集
  useEffect(() => {
    setIsLoading(true)
    if(id !== '') {
        getGenreSearch(id).then((res) => {
          setCurrentPage(res.page)
          setMovies(res.results)
        })
    } 
    setIsLoading(false)
  }, [id])
  //取得此類型電影集評分
  useEffect(() => {
    let arr = []
    let arr2 = []
    let loadingArr = []
    async function getMoviesRatings() {
      // setIsLoading(true)
      for(let i = 0; i < movies.length; i++) {
        await getIMDBID(movies[i].id).then((res) => {
          arr.push(res.imdb_id)
        })
      }
      for(let i = 0; i < arr.length; i++) {
        await getMovieRating(arr[i]).then((res) => {
          arr2.push(res.Ratings)
          isRatingLoading.current[i] = false
          // setIsRatingLoading(() => {
          //   isRatingLoading.map((item, index) => {
  
          //     return index == i ? "" : item
          //   })
          // })
          // this.setState({
          //   array: array.map((item, _index) => _index == index ? {...item, [key]: value} : item)
          // });
          // loadingArr.push(true)
        })
      }
      setRating(arr2)
    }
    getMoviesRatings()
  }, [movies])



  useEffect(() => {
    getGenre().then((res) => {
      let genreArr = []
      for(let i = 0; i < res.genres.length; i++) {
        genreArr.push(res.genres[i])
      }
      setGenre(genreArr)
    })
  }, [])
  const handleTypeChange = (id) => {
    history.push(`/search/genre/${id}`)
  }
  const handlePageChange = (page) => {
    setIsLoading(true)
    isRatingLoading.current = Array(20).fill(true)
    if(id !== '') {
      getGenreSearch(id, page).then((res) => {
        setCurrentPage(res.page)
        setMovies(res.results)
      })
    }
    setIsLoading(false)
  }
  return (
    <Container>
      <Loading isLoading={isLoading} />
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
      {/* <TypeList>
      {genres && <select name="genre" id="genre" onChange={(e) => {handleTypeChange(e.target.value)}}>
          {genres.map((genre) => {
            return <option value={genre.id}>{genre.name}</option>
          })}
      </select>}
      </TypeList> */}
        {movies && movies.map((item, index) => {
          console.log('Loading', isRatingLoading.current[index])
          return <ItemContainer><Movie plusMargin="3%" key={item.id} id={item.id} imgUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`} rating={Rating[index]} isRatingLoading={isRatingLoading.current[index]} isRating={true}/></ItemContainer>
        })}
      </ResultContainer>
      <PageContainer>
        {currentPage !== 1 ? <button onClick={() => {handlePageChange(currentPage - 1)}}>上一頁</button> : ""}
         {currentPage}
         <button onClick={() => {handlePageChange(currentPage + 1)}}>下一頁</button>
      </PageContainer>
    </Container>

  )
}