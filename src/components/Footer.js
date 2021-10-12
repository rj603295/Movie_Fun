import React from 'react'
import styled from 'styled-components'
import { Link, useLocation, useHistory } from 'react-router-dom'
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
  @media (max-width: 415px) {
    font-size: 18px;
  }
`

export default function Footer () {
  return (
    <FooterContainer>
      <BrandSection>
        <FontAwesomeIcon icon={faGithub} />
        <FontAwesomeIcon icon={faFacebook} />
        <FontAwesomeIcon icon={faInstagram} />
        <FontAwesomeIcon icon={faTwitter} />
        <FontAwesomeIcon icon={faYoutube} />
      </BrandSection>
      <FontAwesomeIcon icon={faCopyright} /><span>  2021 - Moive Fun Inc.</span>
    </FooterContainer>
  )
}