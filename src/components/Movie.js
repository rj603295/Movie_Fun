import React, { useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faCheck  } from '@fortawesome/free-solid-svg-icons'
import AuthContext from '../context'
import {
  getDatabase,
  ref,
  update,
  onValue,
  query,
  orderByChild,
  equalTo,
  set,
  runTransaction
} from "firebase/database";
import Loading from './Loading'
import RatingLoading from './RatingLoading'

const MovieContainer = styled.div`
  height: ${props => props.height};
  width: 100%;
`
const ImgContainer = styled(Link)`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: end;
  justify-content: end;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
`
const RatingListRow = styled.div`
  text-align: left;
  background: white;
  color: black;
  list-style: none;
  border-radius: 5px;
  border: 3px solid grey;
  font-size: 10px;
  font-weight: bold;
  margin-right: 5px;
  position: relative;
  margin-right: ${props => props.ratingMargin};
`
const Heart = styled.div`
  color: white;
  font-weight: bold;
  font-size: 24px;
  position: absolute;
  top: 1%;
  right: ${props => props.plusMargin};
  background: grey;
  border: 3px solid grey;
  border-radius: 50%;
  svg{
    margin: 8px;
  }
  &:hover{
    
  }
`
export default function Movie ({ imgUrl, rating, id, isRating=false, isRatingLoading=false, height="500px", plusMargin, ratingMargin }) { 

  const { user } = useContext(AuthContext)
  const { userFavorite } = useContext(AuthContext)
  const db = getDatabase()
  let keysArr = []
  if((userFavorite !== null) && (Object.keys(userFavorite).length !== 0)){
    keysArr = Object.keys(userFavorite)
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

  const handleFavoriteMovie = (e) => {
    e.preventDefault()
    //let favoriteMovieIdArr = Object.keys(userFavorite)
    if(user && keysArr.includes(id.toString())) {
      runTransaction(ref(db, 'favorite/' + user.uid), (movie) => {
        console.log('hello1')
        if (movie) {
          movie[`${id}`] = null
        }
        return movie
      });
    } else if (user && !keysArr.includes(id.toString())) {
      let checkData
      onValue(ref(db, 'favorite/' + user.uid), (snapshot) => {
        const data = snapshot.val();
        checkData = data
      });
      if(!checkData) {
        let obj = {}
        obj[`${id}`] = 1;
        set(ref(db, 'favorite/' + user.uid), obj);
      } else {
        runTransaction(ref(db, 'favorite/' + user.uid), (movie) => {
          if (movie) {
            if(keysArr.length === 0){
              movie[`${id}`] = {};
            }
            movie[`${id}`] = 1;
          }
          return movie;
        });
      }
    }
  }
  return (
    <MovieContainer height={height}>
      <ImgContainer style={{ backgroundImage: `url("${imgUrl}")` }} to={`/movie/${id}`}>
      {user && 
      <Heart onClick={handleFavoriteMovie} plusMargin={plusMargin}>
        {keysArr.includes(id.toString()) ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faPlus} />}
      </Heart>}
      <div className="poster_rating_section" style={{ 
            color: `#FFF`
          }}>
        {rating && isRating &&  
        <RatingListRow ratingMargin={ratingMargin}>
          <RatingLoading isLoading={isRatingLoading} />
          <li><img className="logo I_logo" alt="" src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"/> {IMDB !== '' ? IMDB : 'No Data'}</li>
          <li><img className="logo T_logo" alt="" src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Rotten_Tomatoes_logo.svg"/> {tomatoes  !== '' ? tomatoes : 'No Data'}</li>
          <li><img className="logo M_logo" alt="" src="https://upload.wikimedia.org/wikipedia/commons/4/48/Metacritic_logo.svg"/> {Metacritic  !== '' ? Metacritic : 'No Data'}</li>
        </RatingListRow>}
      </div>
      </ImgContainer>
    </MovieContainer>
  )
}