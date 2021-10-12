import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  color: white;
  background-image: linear-gradient(rgba(28, 28, 28, 0.7), rgba(28, 28, 28, 0.7)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100vh;

  width: 100vw;
  backdrop-filter: blur(10px);
  @media (max-width: 415px) {
    height: auto;
    padding-bottom: 5%;
    padding-top: 18%;
  }
`
const AboutSection = styled.div`
  padding-top: 10%;
  h2{
    font-size: 1rem;
    margin-bottom: 2%;
  }
  @media (max-width: 415px) {
    h2{
      font-size: 2.5rem;
    }
  }
`
const LogoSection = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 10%;
  margin-bottom: 5%;
  line-height: 1.5;
  font-size: 0.5rem;
  .IMDB, .tomato, .metacritic{
    width: 100%;
  }
  .tomato, .metacritic{
    background: white;
    border-radius: 8px;
    padding: 5% 5%;
    box-sizing: border-box;
  }
  @media (max-width: 415px) {
    display: block;
    font-size: 1.7rem;
    margin-bottom: 20%;
    .IMDB, .tomato, .metacritic{
      width: 35%;
    }
  }
`
const Wrapper = styled.div`
  max-width: 50%;
  margin: 0 auto;
  margin-top: 5%;
  @media (max-width: 415px) {
    max-width: 80%;
  }
`

export default function AboutPage() {
  return (
    <Container>
      <AboutSection>
      <h2>About us</h2>
      <p>找評分，Fun電影</p>
      </AboutSection>
      <Wrapper>
      <LogoSection>
        <img className="IMDB" alt="" src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"/>
        <p>IMDb的用戶即可以以「1～10顆星」為電影評分，之後IMDb會以數據過濾機制及最小投票數量的限制（目前為1250票）來計算出一個加權平均星數作為評分。 因為IMDb以經常投票的用戶來計票，所以評分算是具客觀參考價值。</p>
      </LogoSection>
      <LogoSection>
        <img className="tomato" alt="" src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Rotten_Tomatoes_logo.svg"/>
        <p>爛番茄的工作人員會追蹤每一部影片的所有評論內容，然後使用使用整合資料的積分來運算，評論正面或負面的新鮮度。當超過60％，即會得到一個鮮紅的番茄作為標記，當低於60％，則會得到綠色被砸爛的番茄作為標記。</p>
      </LogoSection>
      <LogoSection>
        <img className="metacritic" alt="" src="https://upload.wikimedia.org/wikipedia/commons/4/48/Metacritic_logo.svg"/>
        <p>Metacritic是一個專門收集對於電影、電視節目、音樂專輯、遊戲的評論的網站，網站會整合每個評價的分數再做出一個總評分作為這個項目的評分，在項目的多項短評中，從最好的分數到最壞的分數由下排列，最好的評價分數是綠色到最低的評價分數的黃色、紅色排列。</p>
      </LogoSection>
      </Wrapper>

    </Container>


  )
}