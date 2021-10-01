import React, { useState } from 'react'
import styled from 'styled-components'

const RatingList = styled.div`
  display: flex;
  align-items: end;
  list-style-type:none;
  li{
    margin-right: 20px;
  }
`

export default function Rating({IMDB, tomatoes, Metacritic}) { 

  return (
    <RatingList>
      <li><img className="logo" src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"/> {IMDB !== '' ? IMDB : 'No Data'}</li>
      <li><img className="logo T_logo" src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Rotten_Tomatoes_logo.svg"/> {tomatoes  !== '' ? tomatoes : 'No Data'}</li>
      <li><img className="logo M_logo" src="https://upload.wikimedia.org/wikipedia/commons/4/48/Metacritic_logo.svg"/> {Metacritic  !== '' ? Metacritic : 'No Data'}</li>
    </RatingList>
  )
}