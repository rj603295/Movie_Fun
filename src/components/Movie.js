import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import AuthContext from '../context'
import {
  getDatabase,
  ref,
  onValue,
  set,
  runTransaction
} from 'firebase/database'
import RatingLoading from './RatingLoading'

const MovieContainer = styled.div`
  height: 100%;
  width: 100%;
`
const ImgContainer = styled(Link)`
  display: flex;
  height: auto;
  width: 100%; 
  align-items: end;
  justify-content: end;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  padding: 80.63% 0;
`
const RatingListRow = styled.div`
  text-align: left;
  background: white;
  color: black;
  list-style: none;
  border-radius: 5px;
  border: 3px solid grey;
  font-size: 0.5rem;
  font-weight: bold;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 30%;
  margin-right: 0;
  .logo{
    width: 30%;
  }
  .I_logo{
    padding: 8%;
  }
  li{
    display: flex;
    align-items: center;
  }
  @media (max-width: 1200px) {
    width: 45%;
  }
  @media (max-width: 415px) {
    width: 55%;
    margin-right: 0;
    font-size: 14px;
    .logo{
      width: 30%;
    }
  }
`
const Heart = styled.div`
  svg{
    display: block;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    box-sizing: border-box;
    position: absolute;
    top: 1%;
    right: 1%;
    background: grey;
    border: 3px solid grey;
    border-radius: 50%;
  }
  &:hover{
    
  }
  @media (max-width: 815px) {
    svg{
      font-size: 1.7rem
    }
  }
  @media (max-width: 415px) {
    svg{
      font-size: 3.5rem
    }
  }
`
const Score = styled.span`
  display: inline-block;
  font-size: 12px;
`
function Movie ({
  movie,
  rating,
  isRating = false,
  isRatingLoading = false
}) {
  const imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  const id = movie.id
  const { user } = useContext(AuthContext)
  const { userFavorite } = useContext(AuthContext)
  const db = getDatabase()
  let keysArr = []
  if ((userFavorite !== null) && (Object.keys(userFavorite).length !== 0)) {
    keysArr = Object.keys(userFavorite)
  }
  let IMDB = ''
  let tomatoes = ''
  let Metacritic = ''
  if (rating) {
    for (let i = 0; i < rating.length; i++) {
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

  const handleFavoriteMovie = (e) => {
    e.preventDefault()
    // let favoriteMovieIdArr = Object.keys(userFavorite)
    if (user && keysArr.includes(id.toString())) {
      runTransaction(ref(db, 'favorite/' + user.uid), (movie) => {
        console.log('hello1')
        if (movie) {
          movie[`${id}`] = null
        }
        return movie
      })
    } else if (user && !keysArr.includes(id.toString())) {
      let checkData
      onValue(ref(db, 'favorite/' + user.uid), (snapshot) => {
        const data = snapshot.val()
        checkData = data
      })
      if (!checkData) {
        const obj = {}
        obj[`${id}`] = 1
        set(ref(db, 'favorite/' + user.uid), obj)
      } else {
        runTransaction(ref(db, 'favorite/' + user.uid), (movie) => {
          if (movie) {
            if (keysArr.length === 0) {
              movie[`${id}`] = {}
            }
            movie[`${id}`] = 1
          }
          return movie
        })
      }
    }
  }
  return (
    <MovieContainer>
      <ImgContainer
        style={ { backgroundImage: movie.poster_path ? `url("${imgUrl}")` : 'url("https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg")' } } to={ `/movie/${id}` }
      >
        {user &&
        <Heart onClick={ handleFavoriteMovie }>
          {keysArr.includes(id.toString()) ? <FontAwesomeIcon icon={ faCheck } /> : <FontAwesomeIcon icon={ faPlus } />}
        </Heart>}
        {isRating &&
        <RatingListRow>
          <RatingLoading isLoading={ isRatingLoading } />
          <li><img alt="" className="logo I_logo" src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" /><Score>{IMDB !== '' ? IMDB : 'None'}</Score></li>
          <li><img alt="" className="logo T_logo" src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Rotten_Tomatoes_logo.svg" /><Score>{tomatoes !== '' ? tomatoes : 'None'}</Score></li>
          <li><img alt="" className="logo M_logo" src="https://upload.wikimedia.org/wikipedia/commons/4/48/Metacritic_logo.svg" /><Score>{Metacritic !== '' ? Metacritic : 'None'}</Score></li>
        </RatingListRow>}
      </ImgContainer>
    </MovieContainer>
  )
}

export default React.memo(Movie, (prevProps, nextProps) => {
  if (prevProps.isRatingLoading !== nextProps.isRatingLoading) {
    return false // re-render
  }
  return true // 不會 Re-render
})
