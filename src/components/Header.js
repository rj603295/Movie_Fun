import React, { useContext, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { getSearchData } from '../WebAPI'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons'
import { getAuth, signOut } from 'firebase/auth'
import AuthContext from '../context'
import { getUserDeviceType } from '../utils.js'

const HeaderContainer = styled.div`
  align-items: center;
  height: auto;
  background-color: white;
  width: 100%;
  padding-top: 20px;
  color: white;
  position: fixed;
  top: 0;
  z-index: 99;
  background: transparent;
  transition: all .4s ease-in-out;
  .RWD-S{
    display: none;
  }

  @media (max-width: 415px) {
    .RWD-S{
      display: block;
    } 
  }
`
const Brand = styled(Link)`
  display: block;
  font-size: 1.1rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
  @media (max-width: 415px) {
    font-size: 2.5rem;
    margin-left: 20px; 
  }
`
const NavbarList = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 30%;
  color: white;
  .ham{
    display: none;
  }
  @media (max-width: 415px) {
   .ham{
     display: inline-block;
   }
   .RWD-L{
     display: none;
   }
  }
`
const Nav = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
  width: 30%;
  cursor: pointer;
  color: white;
  text-decoration: none;
  font-size: 0.47rem;
  ${(props) => props.$active &&
  `
    background: rgba(0, 0, 0, 0.1)
  `}
  @media (max-width: 415px) {
    font-size: 2.5rem;
    width: 50%;
  }
`
const Wrapper = styled.div`
  display: flex;
  max-width: 80%;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 415px) {
    max-width: 95%;
    .RWD-L{
      display: none;
    } 
  }
`
const Search = styled.div`
  position: relative;
  width: 30%;
  input{
    display: block;
    height: 60%;
    border-radius: 30px;
    outline: none;
    padding: 3% 0;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    font-size: 0.5rem;
    text-indent: 10px;
  }
  input, textarea {

    font-size: initial;
    
    }
  @media (max-width: 415px) {
    width: 90%;
    margin: 0 auto;
    input{
      color: white;
      background: transparent;
      border: none;
      border-bottom: 1px solid white;
      border-radius: 0;
    }
    input::placeholder{
      color: white;
    }
  }
`
const SearchIcon = styled.button`
  font-size: 0.5rem;
  position: absolute;
  right: 2%;
  top:50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  @media (max-width: 415px) {
    position: static;
    color: white;
    font-size: 2rem;
    .RWD-S{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
`
const HamList = styled.div`
  text-align: center;
  position: absolute;
  right: 2%;
  margin-top: 3%;
  text-align: center;
  transition: all 0.5s ease-in;
  border-radius: 10px;
  background: white;
  display: none;
  flex-direction: column;
  align-items: center;
  width: 25%;
  a{
    display: block;
    color: black;
    font-size: 0.5rem;
    margin: 5% 0;
    svg{
      font-size: 1.5rem;
    }
  }
  .RWD-S{
    display: none;
  }
  @media (max-width: 415px) {
    display: flex;
    color: black;
    a{
      font-size: 14px;
    }

    .RWD-S{
      display: block;
    } 
  }
`
function Header ({ isHide }) {
  const location = useLocation()
  const history = useHistory()
  const [search, setSearch] = useState('')
  const [isHamOpen, setIsHamOpen] = useState(false)
  const [isHamSearchOpen, setIsHamSearchOpen] = useState(false)
  const { user, setUser } = useContext(AuthContext)
  const userDevice = useRef()

  useEffect(() => {
    userDevice.current = getUserDeviceType()
  }, [])

  const handleKeyPressSearch = (e) => {
    if (e.key === 'Enter') {
      setSearch('')
      getSearchData(search).then(() => {
        history.push(`/search/movie/${search}`)
      })
      setIsHamSearchOpen(false)
    }
  }
  const handleSearch = () => {
    setSearch('')
    getSearchData(search).then(() => {
      history.push(`/search/movie/${search}`)
    })
  }
  const handleValueChange = (e) => {
    setSearch(e.target.value)
  }

  const handleLogout = () => {
    const auth = getAuth()
    signOut(auth).then(() => {
      setUser(null)
      // Sign-out successful.
    }).catch((error) => {
      return error
      // An error happened.
    })
  }
  const handleSearchIconOpen = (e) => {
    e.preventDefault()
    setIsHamOpen(false)
    setIsHamSearchOpen(!isHamSearchOpen)
  }
  const handleHamListOpen = (e) => {
    e.preventDefault()
    setIsHamOpen(!isHamOpen)
    setIsHamSearchOpen(false)
  }
  const handleToTop = () => {
    if (location.pathname === '/') {
      window.scrollTo(0, 0)
    }
  }
  useEffect(() => {
    if (isHide === true) {
      setIsHamOpen(false)
    }
  }, [isHide])
  return (
    <HeaderContainer style={ !userDevice.current ? { top: isHide ? '-200px' : '0px' } : { top: '0px' } }>
      <Wrapper>
        <Brand onClick={ handleToTop } to="/">Fun電影</Brand>
        <Search className="RWD-L">
          <input onChange={ (e) => { handleValueChange(e) } } onKeyPress={ (e) => { handleKeyPressSearch(e) } } placeholder="搜尋您想要的電影, 人物...." value={ search }></input>
          <SearchIcon onClick={ handleSearch } ><FontAwesomeIcon icon={ faSearch } /></SearchIcon>
        </Search>
        <NavbarList>
          <Nav $active={ location.pathname === '/about' } className="RWD-L" to="/about">about</Nav>
          {!user && <Nav className="RWD-L" to="/login" >登入</Nav>}
          {user && <Nav className="RWD-L" onClick={ handleLogout } to="/login">登出</Nav>}
          <Nav className="RWD-L" to="/member"><FontAwesomeIcon icon={ faUserCircle } /></Nav>
          <Nav className="RWD-S" onClick={ handleSearchIconOpen } to=""><FontAwesomeIcon icon={ faSearch } /></Nav>
          <Nav className="ham" onClick={ handleHamListOpen } to=""><FontAwesomeIcon icon={ faBars } /></Nav>
        </NavbarList>
      </Wrapper>

      <HamList style={ { right: isHamOpen ? '1%' : '-200px' } }>
        {!user && <Nav to="/login" >登入</Nav>}
        {user && <Nav onClick={ handleLogout } to="/login">登出</Nav>}
        <Nav to="/member" ><FontAwesomeIcon icon={ faUserCircle } /></Nav>
        <Nav $active={ location.pathname === '/about' } to="/about">about</Nav>
      </HamList>
      <Search className="RWD-S">
        {isHamSearchOpen && <input onChange={ (e) => { handleValueChange(e) } } onKeyPress={ (e) => { handleSearch(e) } } placeholder="搜尋您想要的電影, 人物...." value={ search }></input>}
        {/* {!isHamSearchOpen && <SearchIcon onClick={() => {setIsHamSearchOpen(!isHamSearchOpen)}}><FontAwesomeIcon icon={faSearch} /></SearchIcon> }    */}
      </Search>
      {/* </RWDSRightSection> */}

    </HeaderContainer>
  )
}

export default React.memo(Header, (prevProps, nextProps) => {
  if (prevProps.isHide !== nextProps.isHide) {
    return false // re-render
  }
  return true // 不會 Re-render
})
