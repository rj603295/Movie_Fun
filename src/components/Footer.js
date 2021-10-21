import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-regular-svg-icons'
import { faGithub, faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'


const FooterContainer = styled.div`
  background: #1C1C1C;
  color: white;
  padding: 40px 0;
  padding-top: 10%;
  font-size: 0.5rem;
  @media (max-width: 415px) {
    font-size: 14px;
  }
`
const BrandSection = styled.div`
  font-size: 1rem;
  svg{
    padding: 10px;
  }
  a{
    color: white;
  }
  @media (max-width: 415px) {
    font-size: 18px;
  }
`

export default function Footer () {
  return (
    <FooterContainer>
      <BrandSection>
        <a href="https://github.com/rj603295" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /></a>
        <a href="https://github.com/rj603295" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faFacebook} /></a>
        <a href="https://github.com/rj603295" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
        <a href="https://github.com/rj603295" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faTwitter} /></a>
        <a href="https://github.com/rj603295" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faYoutube} /></a> 
      </BrandSection>
      <FontAwesomeIcon icon={faCopyright} /><span>  2021 - Moive Fun Inc.</span>
    </FooterContainer>
  )
}