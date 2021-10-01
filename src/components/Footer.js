import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { getSearchData } from '../WebAPI'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUserCircle  } from '@fortawesome/free-solid-svg-icons'
import { faCopyright } from '@fortawesome/free-regular-svg-icons'
import { faGithub, faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { getAuth, signOut } from "firebase/auth"
import AuthContext from '../context'


const FooterContainer = styled.div`
  background: #1C1C1C;
  color: white;
  padding: 40px 0;
  padding-top: 150px;
`
const BrandSection = styled.div`
  font-size: 40px;
  svg{
    padding: 10px;
  }
`

export default function Footer () {
  const location = useLocation()
  const history = useHistory()
  const [search, setSearch] = useState('')
  const { user, setUser } = useContext(AuthContext)


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