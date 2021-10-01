import React from 'react'
import styled from 'styled-components'
import loadingImg from './ZZ5H.gif'

const Container = styled.div`
  background: rgba(255, 255, 255, 1);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 99999;
  img{
    height: 30px;
    width: 30px;
  }
`
const ImgContainer = styled.div`
  position: absolute;
  top:40%;
  left: 50%;
  transform: translate(-50%, -50%);
`
export default function Loading ({ isLoading=false }) {

  return (
    <div>
      {isLoading && <Container>
        <ImgContainer>
          <img src={loadingImg} alt=""/>
        </ImgContainer>
      </Container>}
    </div>

  )
}