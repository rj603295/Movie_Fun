import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { getPeopleDetail, getPeopleMovies, getPeopleDetailEng } from '../../WebAPI'
import Movie from '../../components/Movie'
import Carousel from '../../components/Carousel'

const Container = styled.div`
  background: #1C1C1C;
  color: white;
`
const ImgContainer = styled.div`
  height: 500px;
  width: 50%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  @media (max-width: 415px) {
    width: 100%;
  }
`
const PersonContainer = styled.div`
  padding: 0 20%; 
  padding-top: 10%;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  @media (max-width: 415px) {
    display: block;
    padding: 25% 0 10% 0;
  }
`
const PersonContent = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
  line-height: 1.5;
  font-size: 0.4rem;
  @media (max-width: 415px) {
    width: 100%;
    font-size: 16px;
  }
`
const FamousMovieSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
  }
`
const Biography = styled.p`
  margin-top: 3%;
  line-height: 1.5;
  @media (max-width: 415px) {
    line-height: 1.5;
    
  }
`
const Title = styled.h2`
  margin-top: 60px;
`
const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 80%;
  @media (max-width: 415px) {
    max-wdith: 90%;
  }
`
const ItemContainer = styled.div`
  width: 23%;
  margin: 1%;
  @media (max-width: 415px) {
    width: 45%;
  }
`
const CarouselConatiner = styled.div`
  max-width: 95%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #1C1C1C;
`
const NotFoundMessage = styled.p`
  text-align: center;
  margin-top: 2%;
`
const LanguageButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  ${(props) => props.$active &&
    `
      background: white;
      color: black;
    `}
`
export default function CreditPage() {
  const [person, setPerson] = useState({})
  const [biography, setBiography] = useState("")
  const [biographyLang, setBiographyLang] = useState("chi")
  const [famousMovie, setfamousMovie] = useState([])
  const [otherMovie, setotherMovie] = useState([])
  const { id } = useParams()

  useEffect(() => {
    getPeopleDetail(id).then((res) => {
      setPerson(res)
      setBiography(res.biography)
    }).catch((err) => {
      return err
    })
    getPeopleMovies(id).then((res) => {
      let arr = res.cast
      .sort((a, b) => {
        return b.popularity - a.popularity
      })
      .slice(0, 4)
      let arr2 = res.cast
      .sort((a, b) => {
        return b.popularity - a.popularity
      })
      .slice(4, res.cast.length-1)
      setfamousMovie(arr)
      setotherMovie(arr2)
    }).catch((err) => {
      return err
    })
  }, [id])

  const handleBioLanguage = (language) => {
    if (language === 'eng') {
      getPeopleDetailEng(id).then((res) => {
        setBiography(res.biography)
        setBiographyLang('eng')
      })
    }
    if (language === 'chi') {
      getPeopleDetail(id).then((res) => {
        setBiography(res.biography)
        setBiographyLang('chi')
      })
    }

  }
  return (
    <Container>
      <Wrapper>
      <PersonContainer>
        {person.profile_path && 
        <ImgContainer style={{backgroundImage: `url("https://image.tmdb.org/t/p/w500${person.profile_path}")`}}>
        </ImgContainer>}
        <PersonContent>
          <h2>{person.name}</h2>
          {person.birthday ? <p>生日：{person.birthday}</p> : <NotFoundMessage>生日：目前沒有資料</NotFoundMessage>}
          {person.place_of_birth ? <p>出生地：{person.place_of_birth}</p> : <NotFoundMessage>出生地：目前沒有資料</NotFoundMessage>}
        </PersonContent>
      </PersonContainer>
      <LanguageButton onClick={() => {handleBioLanguage('chi')}} $active={biographyLang === 'chi'}>中文版</LanguageButton>
      <LanguageButton onClick={() => {handleBioLanguage('eng')}} $active={biographyLang === 'eng'}>英文版</LanguageButton><br />
      <Biography>{biography === "" ? "暫時沒有資料" : biography}</Biography>
      <Title>著名電影：</Title>
      <FamousMovieSection >
        {famousMovie.length !== 0 ? (famousMovie.map((item) => {
            return <ItemContainer className="RWD-L">
              <Movie key={item.id} movie={item} id={item.id} imgUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`} /></ItemContainer>            
          })): <NotFoundMessage>目前沒有資料</NotFoundMessage>}
        {famousMovie !== 0 ? (famousMovie.map((item) => {
            return <ItemContainer className="RWD-S"><Movie key={item.id} movie={item} id={item.id} imgUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`} /></ItemContainer>
          })) : <div className="RWD-S"><NotFoundMessage>目前沒有資料</NotFoundMessage></div>}
      </FamousMovieSection>
      <Title>其他電影：</Title>
      <FamousMovieSection>
      <CarouselConatiner>
      {otherMovie.length !== 0 ?
      (<div className="RWD-L">
      <Carousel cols={5} gap={10}>
          {otherMovie && otherMovie.map((item) => {
            return <Carousel.Item>
              <Movie key={item.id} movie={item} id={item.id} imgUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />
              </Carousel.Item>
          })}
      </Carousel>
      </div>) : <div className="RWD-L"><NotFoundMessage>目前沒有資料</NotFoundMessage></div>}
      {otherMovie.length !== 0 ?
      (<div className="RWD-S">
      <Carousel cols={2} gap={10}>
          {otherMovie && otherMovie.map((item) => {
            return <Carousel.Item>
              <Movie key={item.id} movie={item} id={item.id} imgUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />
              </Carousel.Item>
          })}
          </Carousel>
      </div>) : <div className="RWD-S"><NotFoundMessage>目前沒有資料</NotFoundMessage></div>}
      </CarouselConatiner>
      </FamousMovieSection>
      </Wrapper>
    </Container>
  )
}