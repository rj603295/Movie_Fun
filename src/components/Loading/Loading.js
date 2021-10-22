import React from 'react'
import styled from 'styled-components'
import loadingImg from './giphy.gif'

const Container = styled.div`
  background: rgba(0, 0, 0, 0.95);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 99999;
  img{
    height: 150px;
    width: 150px;
  }
`
const ImgContainer = styled.div`
  position: absolute;
  top:40%;
  left: 50%;
  transform: translate(-50%, -50%);
`
export default function Loading ({ isLoading = false }) {
  return (
    <div>
      {isLoading && <Container>
        <ImgContainer>
          <img alt="" src={ loadingImg } />
        </ImgContainer>
      </Container>}
    </div>

  )
}
