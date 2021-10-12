import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const ImgContainer = styled(Link)`
  display: inline-block;
  width: 100%;
  padding: 70% 0;
  margin-right: 5%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  @media (max-width: 415px) {
    
  }
`
const CreditName = styled.p`
  color: white;
  font-size: 0.5rem;
  @media(max-width: 415px) {
    font-size: 14px;
  }
`
export default function Person ({ person, isName=true }) { 
  return (
    <div>
    <ImgContainer style={{ 
      backgroundImage: person.profile_path ? `url("https://image.tmdb.org/t/p/w500${person.profile_path}")` : `url("https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg")` 
    }} to={`/credit/${person.id}`}>     
    </ImgContainer>
    {isName && <CreditName>{person.name}</CreditName>}
    </div>

  )
}