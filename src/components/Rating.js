import React from 'react'
import styled from 'styled-components'

const RatingList = styled.div`
  display: grid;
  grid-template-columns: 30% 30% 30%;
  align-items: end;
  list-style-type:none;
  li{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 2%;
    img{
      margin: 0 auto;
    }
    .logo{
      width: 60%;
    }
    .T_logo{
      padding: 6%;
    }
    .M_logo{
      padding: 8%;
    }
  }
  @media (max-width: 415px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: cetner;
    li{
      .logo{
        width: 50%;
      }
      .T_logo{
        padding: 3%;
      }
      .M_logo{
        padding: 5%;
      }
    }

  }
`
const Score = styled.span`
  display: inline-block;
  font-size: 0.5rem;
`

export default function Rating({Ratings, logoWidth="75px"}) { 
  
  let IMDB = ''
  let tomatoes = ''
  let Metacritic = ''
  if (Ratings) {
    for(let i = 0; i < Ratings.length; i++) {
      if (Ratings[i].Source === 'Internet Movie Database') {
        IMDB = Ratings[i].Value
      }
      if (Ratings[i].Source === 'Rotten Tomatoes') {
        tomatoes = Ratings[i].Value
      }
      if (Ratings[i].Source === 'Metacritic') {
        Metacritic = Ratings[i].Value
      }
    }
  }
  return (
    <RatingList logoWidth={logoWidth}>
      <li><div className="logo"><img className="logo I_logo" alt="" src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"/></div><Score>{IMDB !== '' ? IMDB : 'None'}</Score></li>
      <li><div className="logo"><img className="logo T_logo" alt="" src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Rotten_Tomatoes_logo.svg"/></div><Score>{tomatoes  !== '' ? tomatoes : 'None'}</Score></li>
      <li><div className="logo"><img className="logo M_logo" alt="" src="https://upload.wikimedia.org/wikipedia/commons/4/48/Metacritic_logo.svg"/></div><Score>{Metacritic  !== '' ? Metacritic : 'None'}</Score></li>
    </RatingList>
  )
}