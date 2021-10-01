import React, { useEffect, useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { Link, useLocation, useHistory, useParams } from 'react-router-dom'
import { getPeopleDetail, getPeopleMovies, getPeopleDetailEng } from '../../WebAPI'
import Movie from '../../components/Movie'
import Carousel from '../../components/Carousel'
import Color, { useColor } from 'color-thief-react'
import RatingList from '../../components/Rating'

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
`
const PersonContainer = styled.div`
  padding: 0 20%; 
  padding-top: 10%;

  display: flex;
  justify-content: center;
`
const PersonContent = styled.div`
  width: 50%;
`
const FamousMovieSection = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const Biography = styled.p`
  
`
const Title = styled.h2`
  margin-top: 60px;
`
const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 80%;
`
const ItemContainer = styled.div`
  width: 23%;
  margin: 1%;
`
const CarouselConatiner = styled.div`
  max-width: 95%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #1C1C1C;
`
// function Credits({ credits }) {
//   return (
//     <CarouselConatiner>
//       <Carousel cols={6} gap={0}>
//         {credits.map((item, index) =>
//           <Carousel.Item key={item.id}>
          
//             <div>
//             {item.profile_path && 
//             <ImgContainer style={{ 
//               backgroundImage: `url("https://image.tmdb.org/t/p/w500${item.profile_path}")` 
//             }}>     
//             </ImgContainer>}
//               <p>{item.original_name}</p>
//             </div>
//           </Carousel.Item>        
//         )}
//         </Carousel>
//       </CarouselConatiner>
//   )
// }
export default function CreditPage() {
  
  const location = useLocation()
  const history = useHistory()
  const [person, setPerson] = useState({})
  const [biography, setBiography] = useState("")
  const [famousMovie, setfamousMovie] = useState([])
  const [otherMovie, setotherMovie] = useState([])
  const { id } = useParams()
  
  useEffect(() => {
    getPeopleDetail(id).then((res) => {
      console.log(res)
      setPerson(res)
      setBiography(res.biography)
    })
    getPeopleMovies(id).then((res) => {
      console.log(res)
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
    })
  }, [id])

  const handleBioLanguage = (language) => {
    if (language === 'eng') {
      getPeopleDetailEng(id).then((res) => {
        setBiography(res.biography)
      })
    }
    if (language === 'chi') {
      getPeopleDetail(id).then((res) => {
        setBiography(res.biography)
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
          <p>生日：{person.birthday}</p>
          <p>出生地：{person.place_of_birth}</p>
          {/* {person.images.profiles.map((item) => {
            return <ImgContainer style={{backgroundImage: `url("https://image.tmdb.org/t/p/w500${item.file_path}")`}}>
            </ImgContainer>
          })} */}
        </PersonContent>
      </PersonContainer>
      <button onClick={() => {handleBioLanguage('chi')}}>中文版</button>
          <button onClick={() => {handleBioLanguage('eng')}}>英文版</button><br />
          <Biography>{biography === "" ? "暫時沒有資料" : biography}</Biography>
      <Title>著名電影：</Title>
      <FamousMovieSection>
      {famousMovie && famousMovie.map((item) => {
            return <ItemContainer><Movie height="500px" key={item.id} id={item.id} imgUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`} /></ItemContainer>
          })}

      </FamousMovieSection>
      <Title>其他電影：</Title>
      <FamousMovieSection>
      <CarouselConatiner>
        <Carousel cols={5} gap={10}>
          {otherMovie && otherMovie.map((item) => {
            return <Carousel.Item>
              <Movie height="325px" key={item.id} id={item.id} imgUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />
              </Carousel.Item>
          })}
          </Carousel>
      </CarouselConatiner>


      </FamousMovieSection>
      </Wrapper>



    </Container>


  )
}